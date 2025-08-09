import db from "../config/db.js";

const AluminumItem = {
  findBySubAdminId: async (subAdminId) => {
    const [rows] = await db.query("SELECT * FROM aluminum_items WHERE sub_admin_id = ?", [subAdminId]);
    return rows;
  },

  updateSoldQuantity: async (itemId, subAdminId, newSoldQuantity) => {
    const [result] = await db.query(
      "UPDATE aluminum_items SET sold_quantity = ? WHERE id = ? AND sub_admin_id = ?",
      [newSoldQuantity, itemId, subAdminId]
    );
    return result.affectedRows > 0;
  },
};

export default AluminumItem;
