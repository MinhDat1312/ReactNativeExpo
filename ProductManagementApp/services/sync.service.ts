import { getDb } from '@/db/database';
import NetInfo from '@react-native-community/netinfo';

const BASE_URL = 'https://68308e1e6205ab0d6c398e22.mockapi.io/';

function isoGt(a?: string, b?: string) {
    if (!a && !b) return false;
    if (!b) return true;
    if (!a) return false;
    return new Date(a) > new Date(b);
}

export async function syncNow() {
    const net = await NetInfo.fetch();
    if (!net.isConnected) {
        console.log('[SYNC] Offline – bỏ qua đồng bộ');
        return;
    }

    let pushed = 0,
        pulled = 0,
        deleted = 0,
        failed = 0;

    try {
        const db = await getDb();

        // === SYNC CATEGORIES ===
        const localCats: any[] = await db.getAllAsync('SELECT * FROM categories');
        const remoteCats = await fetch(`${BASE_URL}/categories`).then((r) => r.json());

        for (const local of localCats) {
            const remote = remoteCats.find((r: any) => String(r.id) === String(local.remote_id));

            if (!remote) {
                // Không có trên remote → tạo mới
                const res = await fetch(`${BASE_URL}/categories`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: local.name,
                        updatedAt: local.updated_at,
                    }),
                });
                const data = await res.json();
                await db.runAsync('UPDATE categories SET remote_id = ? WHERE id = ?', [data.id, local.id]);
                pushed++;
            } else if (isoGt(local.updated_at, remote.updatedAt)) {
                // Local mới hơn → PUT lên remote
                await fetch(`${BASE_URL}/categories/${remote.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: local.name,
                        updatedAt: local.updated_at,
                    }),
                });
                pushed++;
            } else if (isoGt(remote.updatedAt, local.updated_at)) {
                // Remote mới hơn → UPDATE local
                await db.runAsync('UPDATE categories SET name = ?, updated_at = ? WHERE id = ?', [
                    remote.name,
                    remote.updatedAt,
                    local.id,
                ]);
                pulled++;
            }
        }

        // Thêm các category mới trên remote (chưa có local)
        for (const rc of remoteCats) {
            const local = localCats.find((c) => String(c.remote_id) === String(rc.id));
            if (!local) {
                await db.runAsync('INSERT INTO categories (name, remote_id, updated_at) VALUES (?, ?, ?)', [
                    rc.name,
                    String(rc.id),
                    rc.updatedAt,
                ]);
                pulled++;
            }
        }

        // === SYNC PRODUCTS ===
        const localProds: any[] = await db.getAllAsync('SELECT * FROM products');
        const remoteProds = await fetch(`${BASE_URL}/products`).then((r) => r.json());
        const localCatsAfter: any[] = await db.getAllAsync('SELECT * FROM categories');

        for (const local of localProds) {
            if (local.is_deleted) {
                // Local đánh dấu xóa → DELETE remote
                if (local.remote_id) {
                    await fetch(`${BASE_URL}/products/${local.remote_id}`, { method: 'DELETE' });
                    deleted++;
                }
                continue;
            }

            const remote = remoteProds.find((r: any) => String(r.id) === String(local.remote_id));
            const cat = localCatsAfter.find((c) => String(c.id) === String(local.category_id));
            const remoteCatId = cat?.remote_id;

            if (!remote) {
                // Chưa có trên remote → POST
                const res = await fetch(`${BASE_URL}/products`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: local.name,
                        price: local.price,
                        unit: local.unit,
                        description: local.description,
                        image_uri: local.image_uri,
                        categoryId: remoteCatId,
                        updatedAt: local.updated_at,
                    }),
                });
                const data = await res.json();
                await db.runAsync('UPDATE products SET remote_id = ? WHERE id = ?', [data.id, local.id]);
                pushed++;
            } else if (isoGt(local.updated_at, remote.updatedAt)) {
                // Local mới hơn → PUT lên remote
                await fetch(`${BASE_URL}/products/${remote.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: local.name,
                        price: local.price,
                        unit: local.unit,
                        description: local.description,
                        image_uri: local.image_uri,
                        categoryId: remoteCatId,
                        updatedAt: local.updated_at,
                    }),
                });
                pushed++;
            } else if (isoGt(remote.updatedAt, local.updated_at)) {
                // Remote mới hơn → UPDATE local
                const cat = localCatsAfter.find((c) => String(c.remote_id) === String(remote.categoryId));
                const localCatId = cat ? cat.id : null;
                if (!localCatId) continue;

                await db.runAsync(
                    'UPDATE products SET name=?, price=?, unit=?, description=?, image_uri=?, category_id=?, updated_at=?, is_deleted=0 WHERE id=?',
                    [
                        remote.name,
                        remote.price,
                        remote.unit,
                        remote.description,
                        remote.image_uri,
                        localCatId,
                        remote.updatedAt,
                        local.id,
                    ],
                );
                pulled++;
            }
        }

        // Thêm sản phẩm mới từ remote (chưa có local)
        for (const rp of remoteProds) {
            const local = localProds.find((p) => String(p.remote_id) === String(rp.id));
            const cat = localCatsAfter.find((c) => String(c.remote_id) === String(rp.categoryId));
            const localCatId = cat ? cat.id : null;
            if (!local && localCatId) {
                await db.runAsync(
                    'INSERT INTO products (name, price, unit, description, image_uri, category_id, remote_id, updated_at, is_deleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [
                        rp.name,
                        rp.price,
                        rp.unit,
                        rp.description,
                        rp.image_uri,
                        localCatId,
                        String(rp.id),
                        rp.updatedAt,
                        0,
                    ],
                );
                pulled++;
            }
        }

        console.log(`[SYNC] Done. pushed=${pushed}, pulled=${pulled}, deleted=${deleted}`);
    } catch (e) {
        console.error('[SYNC] Sync failed', e);
        failed++;
    }

    return { pushed, pulled, deleted, failed };
}
