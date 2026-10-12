import { Coupon, CouponValidationResult } from '@/types/crm';
import { DB_KEYS, getDbItem, setDbItem } from './db';
import { INITIAL_SEEDED_COUPONS } from '@/data/seedMarketing';

/**
 * Fetch all coupons for a resort
 */
export function getCoupons(resortId?: string): Coupon[] {
  const all = getDbItem<Coupon[]>(DB_KEYS.COUPONS, INITIAL_SEEDED_COUPONS);
  if (!resortId) return all;
  return all.filter((c) => c.resort_id === resortId);
}

/**
 * Find coupon by uppercase code
 */
export function getCouponByCode(code: string, resortId?: string): Coupon | undefined {
  const all = getCoupons(resortId);
  const normalized = code.trim().toUpperCase();
  return all.find((c) => c.code.toUpperCase() === normalized);
}

/**
 * Validate coupon application against order amount and stay duration
 */
export function validateCoupon(
  code: string,
  orderAmount: number,
  stayNights: number = 1,
  resortId?: string
): CouponValidationResult {
  const normalized = code.trim().toUpperCase();
  if (!normalized) {
    return {
      isValid: false,
      discountAmount: 0,
      discountType: 'percentage',
      discountValue: 0,
      message: 'Please enter a coupon code.',
    };
  }

  const coupon = getCouponByCode(normalized, resortId);
  if (!coupon) {
    return {
      isValid: false,
      discountAmount: 0,
      discountType: 'percentage',
      discountValue: 0,
      message: `Coupon "${normalized}" is invalid or does not exist for this property.`,
    };
  }

  if (!coupon.is_active) {
    return {
      isValid: false,
      discountAmount: 0,
      discountType: coupon.discount_type,
      discountValue: coupon.discount_value,
      coupon,
      message: `Coupon "${coupon.code}" is currently disabled.`,
    };
  }

  // Check validity dates (YYYY-MM-DD)
  const todayStr = new Date().toISOString().slice(0, 10);
  if (coupon.valid_from && todayStr < coupon.valid_from) {
    return {
      isValid: false,
      discountAmount: 0,
      discountType: coupon.discount_type,
      discountValue: coupon.discount_value,
      coupon,
      message: `Coupon "${coupon.code}" is not yet active (valid from ${coupon.valid_from}).`,
    };
  }

  if (coupon.valid_to && todayStr > coupon.valid_to) {
    return {
      isValid: false,
      discountAmount: 0,
      discountType: coupon.discount_type,
      discountValue: coupon.discount_value,
      coupon,
      message: `Coupon "${coupon.code}" expired on ${coupon.valid_to}.`,
    };
  }

  // Check usage limit
  if (coupon.usage_limit > 0 && coupon.used_count >= coupon.usage_limit) {
    return {
      isValid: false,
      discountAmount: 0,
      discountType: coupon.discount_type,
      discountValue: coupon.discount_value,
      coupon,
      message: `Coupon "${coupon.code}" has reached its maximum usage limit (${coupon.usage_limit}).`,
    };
  }

  // Check min stay nights
  if (stayNights < coupon.min_stay_nights) {
    return {
      isValid: false,
      discountAmount: 0,
      discountType: coupon.discount_type,
      discountValue: coupon.discount_value,
      coupon,
      message: `Coupon requires a minimum stay of ${coupon.min_stay_nights} night(s). (Current: ${stayNights} night${stayNights > 1 ? 's' : ''})`,
    };
  }

  // Check min spend
  if (orderAmount < coupon.min_spend) {
    return {
      isValid: false,
      discountAmount: 0,
      discountType: coupon.discount_type,
      discountValue: coupon.discount_value,
      coupon,
      message: `Order amount (₹${orderAmount.toLocaleString('en-IN')}) is below minimum spend threshold of ₹${coupon.min_spend.toLocaleString('en-IN')}.`,
    };
  }

  // Calculate discount amount
  let discountAmount = 0;
  if (coupon.discount_type === 'percentage') {
    discountAmount = Math.round((orderAmount * coupon.discount_value) / 100);
  } else {
    // Fixed amount
    discountAmount = Math.min(coupon.discount_value, orderAmount);
  }

  return {
    isValid: true,
    discountAmount,
    discountType: coupon.discount_type,
    discountValue: coupon.discount_value,
    coupon,
    message: `Coupon "${coupon.code}" applied! Saved ₹${discountAmount.toLocaleString('en-IN')}.`,
  };
}

/**
 * Increment usage count of a coupon
 */
export function incrementCouponUsage(code: string, resortId?: string): boolean {
  const all = getDbItem<Coupon[]>(DB_KEYS.COUPONS, INITIAL_SEEDED_COUPONS);
  const normalized = code.trim().toUpperCase();
  const index = all.findIndex(
    (c) => c.code.toUpperCase() === normalized && (!resortId || c.resort_id === resortId)
  );

  if (index === -1) return false;

  all[index] = {
    ...all[index],
    used_count: (all[index].used_count || 0) + 1,
  };

  setDbItem(DB_KEYS.COUPONS, all);
  return true;
}

/**
 * Create a new coupon
 */
export function createCoupon(
  data: Omit<Coupon, 'id' | 'created_at' | 'used_count'>,
  resortId: string,
  _user?: any
): { success: boolean; data?: Coupon; error?: string } {
  try {
    const all = getDbItem<Coupon[]>(DB_KEYS.COUPONS, INITIAL_SEEDED_COUPONS);
    const normalizedCode = data.code.trim().toUpperCase();

    // Check for duplicate code in the same resort
    const exists = all.some(
      (c) => c.resort_id === resortId && c.code.toUpperCase() === normalizedCode
    );
    if (exists) {
      return { success: false, error: `Coupon code "${normalizedCode}" already exists for this resort.` };
    }

    const newCoupon: Coupon = {
      ...data,
      id: `cpn-${Date.now().toString().slice(-6)}`,
      resort_id: resortId,
      code: normalizedCode,
      used_count: 0,
      created_at: new Date().toISOString(),
    };

    setDbItem(DB_KEYS.COUPONS, [newCoupon, ...all]);
    return { success: true, data: newCoupon };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create coupon' };
  }
}

/**
 * Update an existing coupon
 */
export function updateCoupon(
  id: string,
  data: Partial<Coupon>,
  resortId: string,
  _user?: any
): { success: boolean; data?: Coupon; error?: string } {
  try {
    const all = getDbItem<Coupon[]>(DB_KEYS.COUPONS, INITIAL_SEEDED_COUPONS);
    const index = all.findIndex((c) => c.id === id && c.resort_id === resortId);

    if (index === -1) {
      return { success: false, error: 'Coupon not found' };
    }

    const current = all[index];
    const updatedCode = data.code ? data.code.trim().toUpperCase() : current.code;

    // Check code duplication if code is changed
    if (data.code && updatedCode !== current.code) {
      const duplicate = all.some(
        (c) => c.id !== id && c.resort_id === resortId && c.code.toUpperCase() === updatedCode
      );
      if (duplicate) {
        return { success: false, error: `Coupon code "${updatedCode}" already in use.` };
      }
    }

    const updated: Coupon = {
      ...current,
      ...data,
      code: updatedCode,
    };

    all[index] = updated;
    setDbItem(DB_KEYS.COUPONS, all);
    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update coupon' };
  }
}

/**
 * Delete a coupon
 */
export function deleteCoupon(
  id: string,
  resortId: string,
  _user?: any
): { success: boolean; error?: string } {
  try {
    const all = getDbItem<Coupon[]>(DB_KEYS.COUPONS, INITIAL_SEEDED_COUPONS);
    const filtered = all.filter((c) => !(c.id === id && c.resort_id === resortId));

    if (filtered.length === all.length) {
      return { success: false, error: 'Coupon not found' };
    }

    setDbItem(DB_KEYS.COUPONS, filtered);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete coupon' };
  }
}

/**
 * Toggle active status of a coupon
 */
export function toggleCouponActive(
  id: string,
  resortId: string,
  user?: any
): { success: boolean; data?: Coupon; error?: string } {
  const coupon = getCoupons(resortId).find((c) => c.id === id);
  if (!coupon) return { success: false, error: 'Coupon not found' };
  return updateCoupon(id, { is_active: !coupon.is_active }, resortId, user);
}
