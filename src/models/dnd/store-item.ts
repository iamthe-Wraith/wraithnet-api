import mongoose from 'mongoose';

export interface IItemInit {
    index: string;
    name: string;
}

export interface IItemBase extends IItemInit {
    url: string;
    source: string;
    isMagicItem?: boolean;
    quantity?: number;
}

export interface IReference extends IItemBase {
    type: string;
}

export interface IChoice<T> {
    choose: number;
    type: string;
    from: T[];
}

export interface ICost {
    quantity: number;
    unit: string;
}

export interface IDamage {
    damage_dice: string;
    damage_type: IItemBase;
}

export interface IRange {
    normal: number;
    long: number;
}

export interface IArmorClass {
    base: number;
    dex_bonus: boolean;
    max_bonus: number;
}

export interface IRarities {
    legendary: boolean;
    very_rare: boolean;
    rare: boolean;
    common: boolean;
    uncommon: boolean;
    varies: boolean;
    unknown: boolean;
}

// export interface IStoreMagicItem extends IItemBase {
//     equipment_category: IItemBase;
//     desc: string[];
//     rarity?: keyof IRarities;
// }

// export interface IStoreMagicItemModel extends Document, IStoreMagicItem {}

export interface IContents {
    item: IItemBase;
    quantity: number;
}

export interface ISpeed {
    quantity: number;
    unit: string;
}

export interface IStoreItem extends IItemBase {
    armor_category?: String;
    armor_class?: IArmorClass;
    capacity?: string;
    category_range?: string;
    contents?: IContents[];
    cost: ICost;
    damage?: IDamage;
    desc: string[];
    equipment_category: IItemBase;
    gear_category?: IItemBase;
    properties?: IItemBase[];
    range?: IRange;
    special?: string[];
    speed?: ISpeed;
    stealth_disadvantage?: boolean;
    str_minimum?: number;
    throw_range?: IRange;
    tool_category?: String;
    two_handed_damage?: IDamage;
    vehicle_category?: String;
    weapon_category?: string;
    weapon_range?: string;
    weight: number;
}

export interface IStoreItemModel extends Document, IStoreItem {}

const ItemSchema = new mongoose.Schema({
    index: String,
    name: String,
    url: String,
    equipment_category: {
        index: String,
        name: String,
        url: String,
    },
    gear_category: {
        index: String,
        name: String,
        url: String,
    },
    cost: {
        quantity: Number,
        unit: String,
    },
    desc: [String],
    weight: Number,
    source: String,
    weapon_category: String,
    weapon_range: String,
    category_range: String,
    damage: {
        damage_dice: String,
        damage_type: {
            index: String,
            name: String,
            url: String,
        },
    },
    range: {
        normal: Number,
        long: Number,
    },
    properties: [{
        index: String,
        name: String,
        url: String,
    }],
    tool_category: String,
    vehicle_category: String,
    quantity: Number,
    two_handed_damage: {
        damage_dice: String,
        damage_type: {
            index: String,
            name: String,
            url: String,
        },
    },
    armor_category: String,
    armor_class: {
        base: Number,
        dex_bonus: Boolean,
        max_bonus: Number,
    },
    str_minimum: Number,
    stealth_disadvantage: Boolean,
    contents: [{
        item: {
            index: String,
            name: String,
            url: String,
        },
        quantity: Number,
    }],
    speed: {
        quantity: Number,
        unit: String,
    },
    capacity: String,
    throw_range: {
        normal: Number,
        long: Number,
    },
    special: [String],
    isMagicItem: Boolean,
});

export const StoreItem = mongoose.model<IStoreItemModel>('store-item', ItemSchema);
