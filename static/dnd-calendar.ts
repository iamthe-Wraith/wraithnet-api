

export interface IDnDHoliday {
    name: string;
    alternativeNames?: string[];
    iteration: number;
}

export interface IDnDCalendarDay {
    month?: DnDMonth;
    date?: number;
    dayOfWeek?: string;
    holiday?: IDnDHoliday;
    special?: boolean;
}

export enum DnDMonth {
    Hammer = 'Hammer',
    Alturiak = 'Alturiak',
    Ches = 'Ches',
    Tarsakh = 'Tarsakh',
    Mirtul = 'Mirtul',
    Kythorn = 'Kythorn',
    Flamerule = 'Flamerule',
    Eleasis = 'Eleasis',
    Eleint = 'Eleint',
    Marpenoth = 'Marpenoth',
    Uktar = 'Uktar',
    Nightal = 'Nightal',
}

export const DnDMonthOrder = [
    DnDMonth.Hammer,
    DnDMonth.Alturiak,
    DnDMonth.Ches,
    DnDMonth.Tarsakh,
    DnDMonth.Mirtul,
    DnDMonth.Kythorn,
    DnDMonth.Flamerule,
    DnDMonth.Eleasis,
    DnDMonth.Eleint,
    DnDMonth.Marpenoth,
    DnDMonth.Uktar,
    DnDMonth.Nightal,
];

export const dndCalendar: IDnDCalendarDay[] = [
    {
        month: DnDMonth.Hammer,
        date: 1,
        dayOfWeek: "1st Day"
    },
    {
        month: DnDMonth.Hammer,
        date: 2,
        dayOfWeek: "2nd Day"
    },
    {
        month: DnDMonth.Hammer,
        date: 3,
        dayOfWeek: "3rd Day"
    },
    {
        month: DnDMonth.Hammer,
        date: 4,
        dayOfWeek: "4th Day"
    },
    {
        month: DnDMonth.Hammer,
        date: 5,
        dayOfWeek: "5th Day"
    },
    {
        month: DnDMonth.Hammer,
        date: 6,
        dayOfWeek: "6th Day"
    },
    {
        month: DnDMonth.Hammer,
        date: 7,
        dayOfWeek: "7th Day"
    },
    {
        month: DnDMonth.Hammer,
        date: 8,
        dayOfWeek: "8th Day"
    },
    {
        month: DnDMonth.Hammer,
        date: 9,
        dayOfWeek: "9th Day"
    },
    {
        month: DnDMonth.Hammer,
        date: 10,
        dayOfWeek: "10th Day"
    },
    {
        month: DnDMonth.Hammer,
        date: 11,
        dayOfWeek: "1st Day"
    },
    {
        month: DnDMonth.Hammer,
        date: 12,
        dayOfWeek: "2nd Day"
    },
    {
        month: DnDMonth.Hammer,
        date: 13,
        dayOfWeek: "3rd Day"
    },
    {
        month: DnDMonth.Hammer,
        date: 14,
        dayOfWeek: "4th Day"
    },
    {
        month: DnDMonth.Hammer,
        date: 15,
        dayOfWeek: "5th Day"
    },
    {
        month: DnDMonth.Hammer,
        date: 16,
        dayOfWeek: "6th Day"
    },
    {
        month: DnDMonth.Hammer,
        date: 17,
        dayOfWeek: "7th Day"
    },
    {
        month: DnDMonth.Hammer,
        date: 18,
        dayOfWeek: "8th Day"
    },
    {
        month: DnDMonth.Hammer,
        date: 19,
        dayOfWeek: "9th Day"
    },
    {
        month: DnDMonth.Hammer,
        date: 20,
        dayOfWeek: "10th Day"
    },
    {
        month: DnDMonth.Hammer,
        date: 21,
        dayOfWeek: "1st Day"
    },
    {
        month: DnDMonth.Hammer,
        date: 22,
        dayOfWeek: "2nd Day"
    },
    {
        month: DnDMonth.Hammer,
        date: 23,
        dayOfWeek: "3rd Day"
    },
    {
        month: DnDMonth.Hammer,
        date: 24,
        dayOfWeek: "4th Day"
    },
    {
        month: DnDMonth.Hammer,
        date: 25,
        dayOfWeek: "5th Day"
    },
    {
        month: DnDMonth.Hammer,
        date: 26,
        dayOfWeek: "6th Day"
    },
    {
        month: DnDMonth.Hammer,
        date: 27,
        dayOfWeek: "7th Day"
    },
    {
        month: DnDMonth.Hammer,
        date: 28,
        dayOfWeek: "8th Day"
    },
    {
        month: DnDMonth.Hammer,
        date: 29,
        dayOfWeek: "9th Day"
    },
    {
        month: DnDMonth.Hammer,
        date: 30,
        dayOfWeek: "10th Day",
    },
    {
        month: DnDMonth.Hammer,
        date: 10001,
        special: true,
        holiday: {
            name: "Midwinter",
            alternativeNames: [
                'Deadwinter Day'
            ],
            iteration: 1,
        },
    },
    {
        month: DnDMonth.Alturiak,
        date: 1,
        dayOfWeek: "1st Day",
    },
    {
        month: DnDMonth.Alturiak,
        date: 2,
        dayOfWeek: "2nd Day"
    },
    {
        month: DnDMonth.Alturiak,
        date: 3,
        dayOfWeek: "3rd Day"
    },
    {
        month: DnDMonth.Alturiak,
        date: 4,
        dayOfWeek: "4th Day"
    },
    {
        month: DnDMonth.Alturiak,
        date: 5,
        dayOfWeek: "5th Day"
    },
    {
        month: DnDMonth.Alturiak,
        date: 6,
        dayOfWeek: "6th Day"
    },
    {
        month: DnDMonth.Alturiak,
        date: 7,
        dayOfWeek: "7th Day"
    },
    {
        month: DnDMonth.Alturiak,
        date: 8,
        dayOfWeek: "8th Day"
    },
    {
        month: DnDMonth.Alturiak,
        date: 9,
        dayOfWeek: "9th Day"
    },
    {
        month: DnDMonth.Alturiak,
        date: 10,
        dayOfWeek: "10th Day"
    },
    {
        month: DnDMonth.Alturiak,
        date: 11,
        dayOfWeek: "1st Day"
    },
    {
        month: DnDMonth.Alturiak,
        date: 12,
        dayOfWeek: "2nd Day"
    },
    {
        month: DnDMonth.Alturiak,
        date: 13,
        dayOfWeek: "3rd Day"
    },
    {
        month: DnDMonth.Alturiak,
        date: 14,
        dayOfWeek: "4th Day"
    },
    {
        month: DnDMonth.Alturiak,
        date: 15,
        dayOfWeek: "5th Day"
    },
    {
        month: DnDMonth.Alturiak,
        date: 16,
        dayOfWeek: "6th Day"
    },
    {
        month: DnDMonth.Alturiak,
        date: 17,
        dayOfWeek: "7th Day"
    },
    {
        month: DnDMonth.Alturiak,
        date: 18,
        dayOfWeek: "8th Day"
    },
    {
        month: DnDMonth.Alturiak,
        date: 19,
        dayOfWeek: "9th Day"
    },
    {
        month: DnDMonth.Alturiak,
        date: 20,
        dayOfWeek: "10th Day"
    },
    {
        month: DnDMonth.Alturiak,
        date: 21,
        dayOfWeek: "1st Day"
    },
    {
        month: DnDMonth.Alturiak,
        date: 22,
        dayOfWeek: "2nd Day"
    },
    {
        month: DnDMonth.Alturiak,
        date: 23,
        dayOfWeek: "3rd Day"
    },
    {
        month: DnDMonth.Alturiak,
        date: 24,
        dayOfWeek: "4th Day"
    },
    {
        month: DnDMonth.Alturiak,
        date: 25,
        dayOfWeek: "5th Day"
    },
    {
        month: DnDMonth.Alturiak,
        date: 26,
        dayOfWeek: "6th Day"
    },
    {
        month: DnDMonth.Alturiak,
        date: 27,
        dayOfWeek: "7th Day"
    },
    {
        month: DnDMonth.Alturiak,
        date: 28,
        dayOfWeek: "8th Day"
    },
    {
        month: DnDMonth.Alturiak,
        date: 29,
        dayOfWeek: "9th Day"
    },
    {
        month: DnDMonth.Alturiak,
        date: 30,
        dayOfWeek: "10th Day"
    },
    {
        month: DnDMonth.Ches,
        date: 1,
        dayOfWeek: "1st Day"
    },
    {
        month: DnDMonth.Ches,
        date: 2,
        dayOfWeek: "2nd Day"
    },
    {
        month: DnDMonth.Ches,
        date: 3,
        dayOfWeek: "3rd Day"
    },
    {
        month: DnDMonth.Ches,
        date: 4,
        dayOfWeek: "4th Day"
    },
    {
        month: DnDMonth.Ches,
        date: 5,
        dayOfWeek: "5th Day"
    },
    {
        month: DnDMonth.Ches,
        date: 6,
        dayOfWeek: "6th Day"
    },
    {
        month: DnDMonth.Ches,
        date: 7,
        dayOfWeek: "7th Day"
    },
    {
        month: DnDMonth.Ches,
        date: 8,
        dayOfWeek: "8th Day"
    },
    {
        month: DnDMonth.Ches,
        date: 9,
        dayOfWeek: "9th Day"
    },
    {
        month: DnDMonth.Ches,
        date: 10,
        dayOfWeek: "10th Day"
    },
    {
        month: DnDMonth.Ches,
        date: 11,
        dayOfWeek: "1st Day"
    },
    {
        month: DnDMonth.Ches,
        date: 12,
        dayOfWeek: "2nd Day"
    },
    {
        month: DnDMonth.Ches,
        date: 13,
        dayOfWeek: "3rd Day"
    },
    {
        month: DnDMonth.Ches,
        date: 14,
        dayOfWeek: "4th Day"
    },
    {
        month: DnDMonth.Ches,
        date: 15,
        dayOfWeek: "5th Day"
    },
    {
        month: DnDMonth.Ches,
        date: 16,
        dayOfWeek: "6th Day"
    },
    {
        month: DnDMonth.Ches,
        date: 17,
        dayOfWeek: "7th Day"
    },
    {
        month: DnDMonth.Ches,
        date: 18,
        dayOfWeek: "8th Day"
    },
    {
        month: DnDMonth.Ches,
        date: 19,
        dayOfWeek: "9th Day",
        holiday: {
            name: 'Spring Equinox',
            iteration: 1,
        },
    },
    {
        month: DnDMonth.Ches,
        date: 20,
        dayOfWeek: "10th Day"
    },
    {
        month: DnDMonth.Ches,
        date: 21,
        dayOfWeek: "1st Day"
    },
    {
        month: DnDMonth.Ches,
        date: 22,
        dayOfWeek: "2nd Day"
    },
    {
        month: DnDMonth.Ches,
        date: 23,
        dayOfWeek: "3rd Day"
    },
    {
        month: DnDMonth.Ches,
        date: 24,
        dayOfWeek: "4th Day"
    },
    {
        month: DnDMonth.Ches,
        date: 25,
        dayOfWeek: "5th Day"
    },
    {
        month: DnDMonth.Ches,
        date: 26,
        dayOfWeek: "6th Day"
    },
    {
        month: DnDMonth.Ches,
        date: 27,
        dayOfWeek: "7th Day"
    },
    {
        month: DnDMonth.Ches,
        date: 28,
        dayOfWeek: "8th Day"
    },
    {
        month: DnDMonth.Ches,
        date: 29,
        dayOfWeek: "9th Day"
    },
    {
        month: DnDMonth.Ches,
        date: 30,
        dayOfWeek: "10th Day"
    },
    {
        month: DnDMonth.Tarsakh,
        date: 1,
        dayOfWeek: "1st Day"
    },
    {
        month: DnDMonth.Tarsakh,
        date: 2,
        dayOfWeek: "2nd Day"
    },
    {
        month: DnDMonth.Tarsakh,
        date: 3,
        dayOfWeek: "3rd Day"
    },
    {
        month: DnDMonth.Tarsakh,
        date: 4,
        dayOfWeek: "4th Day"
    },
    {
        month: DnDMonth.Tarsakh,
        date: 5,
        dayOfWeek: "5th Day"
    },
    {
        month: DnDMonth.Tarsakh,
        date: 6,
        dayOfWeek: "6th Day"
    },
    {
        month: DnDMonth.Tarsakh,
        date: 7,
        dayOfWeek: "7th Day"
    },
    {
        month: DnDMonth.Tarsakh,
        date: 8,
        dayOfWeek: "8th Day"
    },
    {
        month: DnDMonth.Tarsakh,
        date: 9,
        dayOfWeek: "9th Day"
    },
    {
        month: DnDMonth.Tarsakh,
        date: 10,
        dayOfWeek: "10th Day"
    },
    {
        month: DnDMonth.Tarsakh,
        date: 11,
        dayOfWeek: "1st Day"
    },
    {
        month: DnDMonth.Tarsakh,
        date: 12,
        dayOfWeek: "2nd Day"
    },
    {
        month: DnDMonth.Tarsakh,
        date: 13,
        dayOfWeek: "3rd Day"
    },
    {
        month: DnDMonth.Tarsakh,
        date: 14,
        dayOfWeek: "4th Day"
    },
    {
        month: DnDMonth.Tarsakh,
        date: 15,
        dayOfWeek: "5th Day"
    },
    {
        month: DnDMonth.Tarsakh,
        date: 16,
        dayOfWeek: "6th Day"
    },
    {
        month: DnDMonth.Tarsakh,
        date: 17,
        dayOfWeek: "7th Day"
    },
    {
        month: DnDMonth.Tarsakh,
        date: 18,
        dayOfWeek: "8th Day"
    },
    {
        month: DnDMonth.Tarsakh,
        date: 19,
        dayOfWeek: "9th Day"
    },
    {
        month: DnDMonth.Tarsakh,
        date: 20,
        dayOfWeek: "10th Day"
    },
    {
        month: DnDMonth.Tarsakh,
        date: 21,
        dayOfWeek: "1st Day"
    },
    {
        month: DnDMonth.Tarsakh,
        date: 22,
        dayOfWeek: "2nd Day"
    },
    {
        month: DnDMonth.Tarsakh,
        date: 23,
        dayOfWeek: "3rd Day"
    },
    {
        month: DnDMonth.Tarsakh,
        date: 24,
        dayOfWeek: "4th Day"
    },
    {
        month: DnDMonth.Tarsakh,
        date: 25,
        dayOfWeek: "5th Day"
    },
    {
        month: DnDMonth.Tarsakh,
        date: 26,
        dayOfWeek: "6th Day"
    },
    {
        month: DnDMonth.Tarsakh,
        date: 27,
        dayOfWeek: "7th Day"
    },
    {
        month: DnDMonth.Tarsakh,
        date: 28,
        dayOfWeek: "8th Day"
    },
    {
        month: DnDMonth.Tarsakh,
        date: 29,
        dayOfWeek: "9th Day"
    },
    {
        month: DnDMonth.Tarsakh,
        date: 30,
        dayOfWeek: "10th Day",
    },
    {
        month: DnDMonth.Tarsakh,
        date: 10001,
        special: true,
        holiday: {
            name: "Greengrass",
            iteration: 1,
        }
    },
    {
        month: DnDMonth.Mirtul,
        date: 1,
        dayOfWeek: "1st Day",
    },
    {
        month: DnDMonth.Mirtul,
        date: 2,
        dayOfWeek: "2nd Day"
    },
    {
        month: DnDMonth.Mirtul,
        date: 3,
        dayOfWeek: "3rd Day"
    },
    {
        month: DnDMonth.Mirtul,
        date: 4,
        dayOfWeek: "4th Day"
    },
    {
        month: DnDMonth.Mirtul,
        date: 5,
        dayOfWeek: "5th Day"
    },
    {
        month: DnDMonth.Mirtul,
        date: 6,
        dayOfWeek: "6th Day"
    },
    {
        month: DnDMonth.Mirtul,
        date: 7,
        dayOfWeek: "7th Day"
    },
    {
        month: DnDMonth.Mirtul,
        date: 8,
        dayOfWeek: "8th Day"
    },
    {
        month: DnDMonth.Mirtul,
        date: 9,
        dayOfWeek: "9th Day"
    },
    {
        month: DnDMonth.Mirtul,
        date: 10,
        dayOfWeek: "10th Day"
    },
    {
        month: DnDMonth.Mirtul,
        date: 11,
        dayOfWeek: "1st Day"
    },
    {
        month: DnDMonth.Mirtul,
        date: 12,
        dayOfWeek: "2nd Day"
    },
    {
        month: DnDMonth.Mirtul,
        date: 13,
        dayOfWeek: "3rd Day"
    },
    {
        month: DnDMonth.Mirtul,
        date: 14,
        dayOfWeek: "4th Day"
    },
    {
        month: DnDMonth.Mirtul,
        date: 15,
        dayOfWeek: "5th Day"
    },
    {
        month: DnDMonth.Mirtul,
        date: 16,
        dayOfWeek: "6th Day"
    },
    {
        month: DnDMonth.Mirtul,
        date: 17,
        dayOfWeek: "7th Day"
    },
    {
        month: DnDMonth.Mirtul,
        date: 18,
        dayOfWeek: "8th Day"
    },
    {
        month: DnDMonth.Mirtul,
        date: 19,
        dayOfWeek: "9th Day"
    },
    {
        month: DnDMonth.Mirtul,
        date: 20,
        dayOfWeek: "10th Day"
    },
    {
        month: DnDMonth.Mirtul,
        date: 21,
        dayOfWeek: "1st Day"
    },
    {
        month: DnDMonth.Mirtul,
        date: 22,
        dayOfWeek: "2nd Day"
    },
    {
        month: DnDMonth.Mirtul,
        date: 23,
        dayOfWeek: "3rd Day"
    },
    {
        month: DnDMonth.Mirtul,
        date: 24,
        dayOfWeek: "4th Day"
    },
    {
        month: DnDMonth.Mirtul,
        date: 25,
        dayOfWeek: "5th Day"
    },
    {
        month: DnDMonth.Mirtul,
        date: 26,
        dayOfWeek: "6th Day"
    },
    {
        month: DnDMonth.Mirtul,
        date: 27,
        dayOfWeek: "7th Day"
    },
    {
        month: DnDMonth.Mirtul,
        date: 28,
        dayOfWeek: "8th Day"
    },
    {
        month: DnDMonth.Mirtul,
        date: 29,
        dayOfWeek: "9th Day"
    },
    {
        month: DnDMonth.Mirtul,
        date: 30,
        dayOfWeek: "10th Day"
    },
    {
        month: DnDMonth.Kythorn,
        date: 1,
        dayOfWeek: "1st Day"
    },
    {
        month: DnDMonth.Kythorn,
        date: 2,
        dayOfWeek: "2nd Day"
    },
    {
        month: DnDMonth.Kythorn,
        date: 3,
        dayOfWeek: "3rd Day"
    },
    {
        month: DnDMonth.Kythorn,
        date: 4,
        dayOfWeek: "4th Day"
    },
    {
        month: DnDMonth.Kythorn,
        date: 5,
        dayOfWeek: "5th Day"
    },
    {
        month: DnDMonth.Kythorn,
        date: 6,
        dayOfWeek: "6th Day"
    },
    {
        month: DnDMonth.Kythorn,
        date: 7,
        dayOfWeek: "7th Day"
    },
    {
        month: DnDMonth.Kythorn,
        date: 8,
        dayOfWeek: "8th Day"
    },
    {
        month: DnDMonth.Kythorn,
        date: 9,
        dayOfWeek: "9th Day"
    },
    {
        month: DnDMonth.Kythorn,
        date: 10,
        dayOfWeek: "10th Day"
    },
    {
        month: DnDMonth.Kythorn,
        date: 11,
        dayOfWeek: "1st Day"
    },
    {
        month: DnDMonth.Kythorn,
        date: 12,
        dayOfWeek: "2nd Day"
    },
    {
        month: DnDMonth.Kythorn,
        date: 13,
        dayOfWeek: "3rd Day"
    },
    {
        month: DnDMonth.Kythorn,
        date: 14,
        dayOfWeek: "4th Day"
    },
    {
        month: DnDMonth.Kythorn,
        date: 15,
        dayOfWeek: "5th Day"
    },
    {
        month: DnDMonth.Kythorn,
        date: 16,
        dayOfWeek: "6th Day"
    },
    {
        month: DnDMonth.Kythorn,
        date: 17,
        dayOfWeek: "7th Day"
    },
    {
        month: DnDMonth.Kythorn,
        date: 18,
        dayOfWeek: "8th Day"
    },
    {
        month: DnDMonth.Kythorn,
        date: 19,
        dayOfWeek: "9th Day"
    },
    {
        month: DnDMonth.Kythorn,
        date: 20,
        dayOfWeek: "10th Day",
        holiday: {
            name: 'Summer Solstice',
            iteration: 1,
        },
    },
    {
        month: DnDMonth.Kythorn,
        date: 21,
        dayOfWeek: "1st Day"
    },
    {
        month: DnDMonth.Kythorn,
        date: 22,
        dayOfWeek: "2nd Day"
    },
    {
        month: DnDMonth.Kythorn,
        date: 23,
        dayOfWeek: "3rd Day"
    },
    {
        month: DnDMonth.Kythorn,
        date: 24,
        dayOfWeek: "4th Day"
    },
    {
        month: DnDMonth.Kythorn,
        date: 25,
        dayOfWeek: "5th Day"
    },
    {
        month: DnDMonth.Kythorn,
        date: 26,
        dayOfWeek: "6th Day"
    },
    {
        month: DnDMonth.Kythorn,
        date: 27,
        dayOfWeek: "7th Day"
    },
    {
        month: DnDMonth.Kythorn,
        date: 28,
        dayOfWeek: "8th Day"
    },
    {
        month: DnDMonth.Kythorn,
        date: 29,
        dayOfWeek: "9th Day"
    },
    {
        month: DnDMonth.Kythorn,
        date: 30,
        dayOfWeek: "10th Day"
    },
    {
        month: DnDMonth.Flamerule,
        date: 1,
        dayOfWeek: "1st Day"
    },
    {
        month: DnDMonth.Flamerule,
        date: 2,
        dayOfWeek: "2nd Day"
    },
    {
        month: DnDMonth.Flamerule,
        date: 3,
        dayOfWeek: "3rd Day"
    },
    {
        month: DnDMonth.Flamerule,
        date: 4,
        dayOfWeek: "4th Day"
    },
    {
        month: DnDMonth.Flamerule,
        date: 5,
        dayOfWeek: "5th Day"
    },
    {
        month: DnDMonth.Flamerule,
        date: 6,
        dayOfWeek: "6th Day"
    },
    {
        month: DnDMonth.Flamerule,
        date: 7,
        dayOfWeek: "7th Day"
    },
    {
        month: DnDMonth.Flamerule,
        date: 8,
        dayOfWeek: "8th Day"
    },
    {
        month: DnDMonth.Flamerule,
        date: 9,
        dayOfWeek: "9th Day"
    },
    {
        month: DnDMonth.Flamerule,
        date: 10,
        dayOfWeek: "10th Day"
    },
    {
        month: DnDMonth.Flamerule,
        date: 11,
        dayOfWeek: "1st Day"
    },
    {
        month: DnDMonth.Flamerule,
        date: 12,
        dayOfWeek: "2nd Day"
    },
    {
        month: DnDMonth.Flamerule,
        date: 13,
        dayOfWeek: "3rd Day"
    },
    {
        month: DnDMonth.Flamerule,
        date: 14,
        dayOfWeek: "4th Day"
    },
    {
        month: DnDMonth.Flamerule,
        date: 15,
        dayOfWeek: "5th Day"
    },
    {
        month: DnDMonth.Flamerule,
        date: 16,
        dayOfWeek: "6th Day"
    },
    {
        month: DnDMonth.Flamerule,
        date: 17,
        dayOfWeek: "7th Day"
    },
    {
        month: DnDMonth.Flamerule,
        date: 18,
        dayOfWeek: "8th Day"
    },
    {
        month: DnDMonth.Flamerule,
        date: 19,
        dayOfWeek: "9th Day"
    },
    {
        month: DnDMonth.Flamerule,
        date: 20,
        dayOfWeek: "10th Day"
    },
    {
        month: DnDMonth.Flamerule,
        date: 21,
        dayOfWeek: "1st Day"
    },
    {
        month: DnDMonth.Flamerule,
        date: 22,
        dayOfWeek: "2nd Day"
    },
    {
        month: DnDMonth.Flamerule,
        date: 23,
        dayOfWeek: "3rd Day"
    },
    {
        month: DnDMonth.Flamerule,
        date: 24,
        dayOfWeek: "4th Day"
    },
    {
        month: DnDMonth.Flamerule,
        date: 25,
        dayOfWeek: "5th Day"
    },
    {
        month: DnDMonth.Flamerule,
        date: 26,
        dayOfWeek: "6th Day"
    },
    {
        month: DnDMonth.Flamerule,
        date: 27,
        dayOfWeek: "7th Day"
    },
    {
        month: DnDMonth.Flamerule,
        date: 28,
        dayOfWeek: "8th Day"
    },
    {
        month: DnDMonth.Flamerule,
        date: 29,
        dayOfWeek: "9th Day"
    },
    {
        month: DnDMonth.Flamerule,
        date: 30,
        dayOfWeek: "10th Day",
    },
    {
        month: DnDMonth.Flamerule,
        date: 10001,
        special: true,
        holiday: {
            name: "Midsummer",
            iteration: 1,
        },
    },
    {
        month: DnDMonth.Flamerule,
        date: 10002,
        special: true,
        holiday: {
            name: "Shieldmeet",
            alternativeNames: [
                'Cinnaelos\'Cor ',
                'Cinnaeloscor',
                'the Day of Corellon\'s Peace',
            ],
            iteration: 4,
        }
    },
    {
        month: DnDMonth.Eleasis,
        date: 1,
        dayOfWeek: "1st Day",
    },
    {
        month: DnDMonth.Eleasis,
        date: 2,
        dayOfWeek: "2nd Day"
    },
    {
        month: DnDMonth.Eleasis,
        date: 3,
        dayOfWeek: "3rd Day"
    },
    {
        month: DnDMonth.Eleasis,
        date: 4,
        dayOfWeek: "4th Day"
    },
    {
        month: DnDMonth.Eleasis,
        date: 5,
        dayOfWeek: "5th Day"
    },
    {
        month: DnDMonth.Eleasis,
        date: 6,
        dayOfWeek: "6th Day"
    },
    {
        month: DnDMonth.Eleasis,
        date: 7,
        dayOfWeek: "7th Day"
    },
    {
        month: DnDMonth.Eleasis,
        date: 8,
        dayOfWeek: "8th Day"
    },
    {
        month: DnDMonth.Eleasis,
        date: 9,
        dayOfWeek: "9th Day"
    },
    {
        month: DnDMonth.Eleasis,
        date: 10,
        dayOfWeek: "10th Day"
    },
    {
        month: DnDMonth.Eleasis,
        date: 11,
        dayOfWeek: "1st Day"
    },
    {
        month: DnDMonth.Eleasis,
        date: 12,
        dayOfWeek: "2nd Day"
    },
    {
        month: DnDMonth.Eleasis,
        date: 13,
        dayOfWeek: "3rd Day"
    },
    {
        month: DnDMonth.Eleasis,
        date: 14,
        dayOfWeek: "4th Day"
    },
    {
        month: DnDMonth.Eleasis,
        date: 15,
        dayOfWeek: "5th Day"
    },
    {
        month: DnDMonth.Eleasis,
        date: 16,
        dayOfWeek: "6th Day"
    },
    {
        month: DnDMonth.Eleasis,
        date: 17,
        dayOfWeek: "7th Day"
    },
    {
        month: DnDMonth.Eleasis,
        date: 18,
        dayOfWeek: "8th Day"
    },
    {
        month: DnDMonth.Eleasis,
        date: 19,
        dayOfWeek: "9th Day"
    },
    {
        month: DnDMonth.Eleasis,
        date: 20,
        dayOfWeek: "10th Day"
    },
    {
        month: DnDMonth.Eleasis,
        date: 21,
        dayOfWeek: "1st Day"
    },
    {
        month: DnDMonth.Eleasis,
        date: 22,
        dayOfWeek: "2nd Day"
    },
    {
        month: DnDMonth.Eleasis,
        date: 23,
        dayOfWeek: "3rd Day"
    },
    {
        month: DnDMonth.Eleasis,
        date: 24,
        dayOfWeek: "4th Day"
    },
    {
        month: DnDMonth.Eleasis,
        date: 25,
        dayOfWeek: "5th Day"
    },
    {
        month: DnDMonth.Eleasis,
        date: 26,
        dayOfWeek: "6th Day"
    },
    {
        month: DnDMonth.Eleasis,
        date: 27,
        dayOfWeek: "7th Day"
    },
    {
        month: DnDMonth.Eleasis,
        date: 28,
        dayOfWeek: "8th Day"
    },
    {
        month: DnDMonth.Eleasis,
        date: 29,
        dayOfWeek: "9th Day"
    },
    {
        month: DnDMonth.Eleasis,
        date: 30,
        dayOfWeek: "10th Day"
    },
    {
        month: DnDMonth.Eleint,
        date: 1,
        dayOfWeek: "1st Day"
    },
    {
        month: DnDMonth.Eleint,
        date: 2,
        dayOfWeek: "2nd Day"
    },
    {
        month: DnDMonth.Eleint,
        date: 3,
        dayOfWeek: "3rd Day"
    },
    {
        month: DnDMonth.Eleint,
        date: 4,
        dayOfWeek: "4th Day"
    },
    {
        month: DnDMonth.Eleint,
        date: 5,
        dayOfWeek: "5th Day"
    },
    {
        month: DnDMonth.Eleint,
        date: 6,
        dayOfWeek: "6th Day"
    },
    {
        month: DnDMonth.Eleint,
        date: 7,
        dayOfWeek: "7th Day"
    },
    {
        month: DnDMonth.Eleint,
        date: 8,
        dayOfWeek: "8th Day"
    },
    {
        month: DnDMonth.Eleint,
        date: 9,
        dayOfWeek: "9th Day"
    },
    {
        month: DnDMonth.Eleint,
        date: 10,
        dayOfWeek: "10th Day"
    },
    {
        month: DnDMonth.Eleint,
        date: 11,
        dayOfWeek: "1st Day"
    },
    {
        month: DnDMonth.Eleint,
        date: 12,
        dayOfWeek: "2nd Day"
    },
    {
        month: DnDMonth.Eleint,
        date: 13,
        dayOfWeek: "3rd Day"
    },
    {
        month: DnDMonth.Eleint,
        date: 14,
        dayOfWeek: "4th Day"
    },
    {
        month: DnDMonth.Eleint,
        date: 15,
        dayOfWeek: "5th Day"
    },
    {
        month: DnDMonth.Eleint,
        date: 16,
        dayOfWeek: "6th Day"
    },
    {
        month: DnDMonth.Eleint,
        date: 17,
        dayOfWeek: "7th Day"
    },
    {
        month: DnDMonth.Eleint,
        date: 18,
        dayOfWeek: "8th Day"
    },
    {
        month: DnDMonth.Eleint,
        date: 19,
        dayOfWeek: "9th Day"
    },
    {
        month: DnDMonth.Eleint,
        date: 20,
        dayOfWeek: "10th Day"
    },
    {
        month: DnDMonth.Eleint,
        date: 21,
        dayOfWeek: "1st Day",
        holiday: {
            name: "Autumn Equinox",
            iteration: 1,
        },
    },
    {
        month: DnDMonth.Eleint,
        date: 22,
        dayOfWeek: "2nd Day"
    },
    {
        month: DnDMonth.Eleint,
        date: 23,
        dayOfWeek: "3rd Day"
    },
    {
        month: DnDMonth.Eleint,
        date: 24,
        dayOfWeek: "4th Day"
    },
    {
        month: DnDMonth.Eleint,
        date: 25,
        dayOfWeek: "5th Day"
    },
    {
        month: DnDMonth.Eleint,
        date: 26,
        dayOfWeek: "6th Day"
    },
    {
        month: DnDMonth.Eleint,
        date: 27,
        dayOfWeek: "7th Day"
    },
    {
        month: DnDMonth.Eleint,
        date: 28,
        dayOfWeek: "8th Day"
    },
    {
        month: DnDMonth.Eleint,
        date: 29,
        dayOfWeek: "9th Day"
    },
    {
        month: DnDMonth.Eleint,
        date: 30,
        dayOfWeek: "10th Day"
    },
    {
        month: DnDMonth.Eleint,
        date: 10001,
        special: true,
        holiday: {
            name: 'Highharvestide',
            iteration: 1,
        },
    },
    {
        month: DnDMonth.Marpenoth,
        date: 1,
        dayOfWeek: "1st Day"
    },
    {
        month: DnDMonth.Marpenoth,
        date: 2,
        dayOfWeek: "2nd Day"
    },
    {
        month: DnDMonth.Marpenoth,
        date: 3,
        dayOfWeek: "3rd Day"
    },
    {
        month: DnDMonth.Marpenoth,
        date: 4,
        dayOfWeek: "4th Day"
    },
    {
        month: DnDMonth.Marpenoth,
        date: 5,
        dayOfWeek: "5th Day"
    },
    {
        month: DnDMonth.Marpenoth,
        date: 6,
        dayOfWeek: "6th Day"
    },
    {
        month: DnDMonth.Marpenoth,
        date: 7,
        dayOfWeek: "7th Day"
    },
    {
        month: DnDMonth.Marpenoth,
        date: 8,
        dayOfWeek: "8th Day"
    },
    {
        month: DnDMonth.Marpenoth,
        date: 9,
        dayOfWeek: "9th Day"
    },
    {
        month: DnDMonth.Marpenoth,
        date: 10,
        dayOfWeek: "10th Day"
    },
    {
        month: DnDMonth.Marpenoth,
        date: 11,
        dayOfWeek: "1st Day"
    },
    {
        month: DnDMonth.Marpenoth,
        date: 12,
        dayOfWeek: "2nd Day"
    },
    {
        month: DnDMonth.Marpenoth,
        date: 13,
        dayOfWeek: "3rd Day"
    },
    {
        month: DnDMonth.Marpenoth,
        date: 14,
        dayOfWeek: "4th Day"
    },
    {
        month: DnDMonth.Marpenoth,
        date: 15,
        dayOfWeek: "5th Day"
    },
    {
        month: DnDMonth.Marpenoth,
        date: 16,
        dayOfWeek: "6th Day"
    },
    {
        month: DnDMonth.Marpenoth,
        date: 17,
        dayOfWeek: "7th Day"
    },
    {
        month: DnDMonth.Marpenoth,
        date: 18,
        dayOfWeek: "8th Day"
    },
    {
        month: DnDMonth.Marpenoth,
        date: 19,
        dayOfWeek: "9th Day"
    },
    {
        month: DnDMonth.Marpenoth,
        date: 20,
        dayOfWeek: "10th Day"
    },
    {
        month: DnDMonth.Marpenoth,
        date: 21,
        dayOfWeek: "1st Day"
    },
    {
        month: DnDMonth.Marpenoth,
        date: 22,
        dayOfWeek: "2nd Day"
    },
    {
        month: DnDMonth.Marpenoth,
        date: 23,
        dayOfWeek: "3rd Day"
    },
    {
        month: DnDMonth.Marpenoth,
        date: 24,
        dayOfWeek: "4th Day"
    },
    {
        month: DnDMonth.Marpenoth,
        date: 25,
        dayOfWeek: "5th Day"
    },
    {
        month: DnDMonth.Marpenoth,
        date: 26,
        dayOfWeek: "6th Day"
    },
    {
        month: DnDMonth.Marpenoth,
        date: 27,
        dayOfWeek: "7th Day"
    },
    {
        month: DnDMonth.Marpenoth,
        date: 28,
        dayOfWeek: "8th Day"
    },
    {
        month: DnDMonth.Marpenoth,
        date: 29,
        dayOfWeek: "9th Day"
    },
    {
        month: DnDMonth.Marpenoth,
        date: 30,
        dayOfWeek: "10th Day"
    },
    {
        month: DnDMonth.Uktar,
        date: 1,
        dayOfWeek: "1st Day"
    },
    {
        month: DnDMonth.Uktar,
        date: 2,
        dayOfWeek: "2nd Day"
    },
    {
        month: DnDMonth.Uktar,
        date: 3,
        dayOfWeek: "3rd Day"
    },
    {
        month: DnDMonth.Uktar,
        date: 4,
        dayOfWeek: "4th Day"
    },
    {
        month: DnDMonth.Uktar,
        date: 5,
        dayOfWeek: "5th Day"
    },
    {
        month: DnDMonth.Uktar,
        date: 6,
        dayOfWeek: "6th Day"
    },
    {
        month: DnDMonth.Uktar,
        date: 7,
        dayOfWeek: "7th Day"
    },
    {
        month: DnDMonth.Uktar,
        date: 8,
        dayOfWeek: "8th Day"
    },
    {
        month: DnDMonth.Uktar,
        date: 9,
        dayOfWeek: "9th Day"
    },
    {
        month: DnDMonth.Uktar,
        date: 10,
        dayOfWeek: "10th Day"
    },
    {
        month: DnDMonth.Uktar,
        date: 11,
        dayOfWeek: "1st Day"
    },
    {
        month: DnDMonth.Uktar,
        date: 12,
        dayOfWeek: "2nd Day"
    },
    {
        month: DnDMonth.Uktar,
        date: 13,
        dayOfWeek: "3rd Day"
    },
    {
        month: DnDMonth.Uktar,
        date: 14,
        dayOfWeek: "4th Day"
    },
    {
        month: DnDMonth.Uktar,
        date: 15,
        dayOfWeek: "5th Day"
    },
    {
        month: DnDMonth.Uktar,
        date: 16,
        dayOfWeek: "6th Day"
    },
    {
        month: DnDMonth.Uktar,
        date: 17,
        dayOfWeek: "7th Day"
    },
    {
        month: DnDMonth.Uktar,
        date: 18,
        dayOfWeek: "8th Day"
    },
    {
        month: DnDMonth.Uktar,
        date: 19,
        dayOfWeek: "9th Day"
    },
    {
        month: DnDMonth.Uktar,
        date: 20,
        dayOfWeek: "10th Day"
    },
    {
        month: DnDMonth.Uktar,
        date: 21,
        dayOfWeek: "1st Day"
    },
    {
        month: DnDMonth.Uktar,
        date: 22,
        dayOfWeek: "2nd Day"
    },
    {
        month: DnDMonth.Uktar,
        date: 23,
        dayOfWeek: "3rd Day"
    },
    {
        month: DnDMonth.Uktar,
        date: 24,
        dayOfWeek: "4th Day"
    },
    {
        month: DnDMonth.Uktar,
        date: 25,
        dayOfWeek: "5th Day"
    },
    {
        month: DnDMonth.Uktar,
        date: 26,
        dayOfWeek: "6th Day"
    },
    {
        month: DnDMonth.Uktar,
        date: 27,
        dayOfWeek: "7th Day"
    },
    {
        month: DnDMonth.Uktar,
        date: 28,
        dayOfWeek: "8th Day"
    },
    {
        month: DnDMonth.Uktar,
        date: 29,
        dayOfWeek: "9th Day"
    },
    {
        month: DnDMonth.Uktar,
        date: 30,
        dayOfWeek: "10th Day"
    },
    {
        month: DnDMonth.Uktar,
        date: 10001,
        special: true,
        holiday: {
            name: "Feast of the Moon",
            alternativeNames: [
                'Moonfest'
            ],
            iteration: 1,
        },
    },
    {
        month: DnDMonth.Nightal,
        date: 1,
        dayOfWeek: "1st Day"
    },
    {
        month: DnDMonth.Nightal,
        date: 2,
        dayOfWeek: "2nd Day"
    },
    {
        month: DnDMonth.Nightal,
        date: 3,
        dayOfWeek: "3rd Day"
    },
    {
        month: DnDMonth.Nightal,
        date: 4,
        dayOfWeek: "4th Day"
    },
    {
        month: DnDMonth.Nightal,
        date: 5,
        dayOfWeek: "5th Day"
    },
    {
        month: DnDMonth.Nightal,
        date: 6,
        dayOfWeek: "6th Day"
    },
    {
        month: DnDMonth.Nightal,
        date: 7,
        dayOfWeek: "7th Day"
    },
    {
        month: DnDMonth.Nightal,
        date: 8,
        dayOfWeek: "8th Day"
    },
    {
        month: DnDMonth.Nightal,
        date: 9,
        dayOfWeek: "9th Day"
    },
    {
        month: DnDMonth.Nightal,
        date: 10,
        dayOfWeek: "10th Day"
    },
    {
        month: DnDMonth.Nightal,
        date: 11,
        dayOfWeek: "1st Day"
    },
    {
        month: DnDMonth.Nightal,
        date: 12,
        dayOfWeek: "2nd Day"
    },
    {
        month: DnDMonth.Nightal,
        date: 13,
        dayOfWeek: "3rd Day"
    },
    {
        month: DnDMonth.Nightal,
        date: 14,
        dayOfWeek: "4th Day"
    },
    {
        month: DnDMonth.Nightal,
        date: 15,
        dayOfWeek: "5th Day"
    },
    {
        month: DnDMonth.Nightal,
        date: 16,
        dayOfWeek: "6th Day"
    },
    {
        month: DnDMonth.Nightal,
        date: 17,
        dayOfWeek: "7th Day"
    },
    {
        month: DnDMonth.Nightal,
        date: 18,
        dayOfWeek: "8th Day"
    },
    {
        month: DnDMonth.Nightal,
        date: 19,
        dayOfWeek: "9th Day"
    },
    {
        month: DnDMonth.Nightal,
        date: 20,
        dayOfWeek: "10th Day",
        holiday: {
            name: "Winter Solstice",
            iteration: 1,
        },
    },
    {
        month: DnDMonth.Nightal,
        date: 21,
        dayOfWeek: "1st Day"
    },
    {
        month: DnDMonth.Nightal,
        date: 22,
        dayOfWeek: "2nd Day"
    },
    {
        month: DnDMonth.Nightal,
        date: 23,
        dayOfWeek: "3rd Day"
    },
    {
        month: DnDMonth.Nightal,
        date: 24,
        dayOfWeek: "4th Day"
    },
    {
        month: DnDMonth.Nightal,
        date: 25,
        dayOfWeek: "5th Day"
    },
    {
        month: DnDMonth.Nightal,
        date: 26,
        dayOfWeek: "6th Day"
    },
    {
        month: DnDMonth.Nightal,
        date: 27,
        dayOfWeek: "7th Day"
    },
    {
        month: DnDMonth.Nightal,
        date: 28,
        dayOfWeek: "8th Day"
    },
    {
        month: DnDMonth.Nightal,
        date: 29,
        dayOfWeek: "9th Day"
    },
    {
        month: DnDMonth.Nightal,
        date: 30,
        dayOfWeek: "10th Day"
    }
]