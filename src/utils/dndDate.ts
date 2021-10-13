import { dndCalendar, DnDMonth, IDnDCalendarDay } from "../../static/dnd-calendar";

enum Reckoning {
    DR = 'DR',
    CR = 'CR',
    TR = 'TR',
    NR = 'NR',
    MC = 'MC',
    NY = 'NY',
    PR = 'PR',
}

interface IDnDYear {
    num: number;
    reckoning: Reckoning;
}

export class DnDDate {
    private _date: IDnDCalendarDay;
    private _year: IDnDYear;

    constructor (date: IDnDCalendarDay = { date: 1, month: DnDMonth.Hammer, dayOfWeek: '1st' }, year: IDnDYear = { num: 1, reckoning: Reckoning.DR }) {
        this._date = date;
        this._year = year;
    }

    get month() {
        return this._date.month;
    }

    get date() {
        return this._date.date;
    }

    get dayOfWeek() {
        return this._date.dayOfWeek;
    }

    get holiday() {
        return this._date.holiday;
    }

    get year() {
        return this._year;
    }

    get special() {
        return this._date.special;
    }

    public isSame = (d: DnDDate) => {
        if (!d) return false;

        return this._date.special
            ? d.month === this.month && d?.holiday?.name === this.holiday.name
            : d.date === this.date && d.month === this.month && d.year.num === this.year.num;
    }

    public setDate = (date: IDnDCalendarDay) => {
        this._date = date;
    }

    public setYear = (year: IDnDYear) => {
        this._year = year;
    }

    public stringify = () => {
        return this._date.special
            ? this._date.holiday.name
            : `${this.date} ${this.month}, ${this.year.num} ${this.year.reckoning}`;
    }

    // requires format: DD MMM, YYYY RR
    static parseStringToDnDDate = (d: string) => {
        const [date, year] = d.split(',');
        const dateParsed = date.trim().split(' ');
        const yearParsed = year.trim().split(' ');
        const dndDate = dndCalendar.find((dndDay: IDnDCalendarDay) => dndDay.date === parseInt(dateParsed[0]) && dndDay.month === dateParsed[1]);
        const dndYear: IDnDYear = { num: parseInt(yearParsed[0]), reckoning: yearParsed[1] as Reckoning };

        if (!dndDate || isNaN(dndYear.num)) throw new Error('invalid dnd date');

        return new DnDDate(dndDate, dndYear);
    }
}