import { dndCalendar, DnDMonth, IDnDCalendarDay } from "../../static/dnd-calendar";


export enum Reckoning {
    DR = 'DR',
    CR = 'CR',
    TR = 'TR',
    NR = 'NR',
    MC = 'MC',
    NY = 'NY',
    PR = 'PR',
}

export interface IDnDYear {
    num: number;
    reckoning: Reckoning;
}

export class DnDDate {
    private _date: number;
    private _month: DnDMonth;
    private _year: number;
    private _reckoning: Reckoning;
    private _calendarDay: IDnDCalendarDay;

    constructor (d?: string) {
        const [date, month, year, reckoning, calendarDay] = DnDDate.parseStringToDnDDate(d);
        this._date = date;
        this._month = month;
        this._year = year;
        this._reckoning = reckoning;
        this._calendarDay = calendarDay;
    }

    get date() {
        return this._date;
    }

    set date(d: number) {
        this._date = d;
        this._calendarDay = DnDDate.getCalendarDay(this.date, this.month);
    }

    get dayOfWeek() {
        return this._calendarDay.dayOfWeek;
    }

    get holiday() {
        return this._calendarDay?.holiday;
    }

    get month() {
        return this._month;
    }

    set month(m: DnDMonth) {
        this._month = m;
        this._calendarDay = DnDDate.getCalendarDay(this.date, this.month);
    }

    get reckoning() {
        return this._reckoning;
    }

    set reckoning(rk: Reckoning) {
        this._reckoning = rk;
        if (!Object.values(Reckoning).filter(r => r === this._reckoning).length) throw new Error(`invalid reckoning (${rk})`);
    }

    get special() {
        return this._calendarDay.special;
    }

    get year() {
        return this._year;
    }

    set year(y: number) {
        this._year = y;
    }

    public clone = () => {
        return new DnDDate(this.stringify());
    }

    public isSame = (d: DnDDate) => {
        if (!d) return false;

        return this._calendarDay.special
            ? d.month === this.month && d?.holiday?.name === this.holiday.name
            : d.date === this.date && d.month === this.month && d.year === this.year && d.reckoning === this.reckoning;
    }

    public stringify = () => {
        const date = this._calendarDay.special
            ? this._calendarDay.holiday.name
            : `${this.date} ${this.month}`;

        return `${date}, ${this.year} ${this.reckoning}`;
    }

    public toNextDate = () => {
        let index = 0;
        for (let i = 0; i < dndCalendar.length; i++) {
            const day = dndCalendar[i];
            if (day.date === this.date && day.month === this.month) {
                index = i;
                break;
            }
        }

        if (index === (dndCalendar.length - 1)) {
            this._calendarDay = dndCalendar[0];
            this._year += 1;
        } else {
            this._calendarDay = dndCalendar[index + 1];
        }

        this._date = this._calendarDay.date;
        this._month = this._calendarDay.month;
    }

    public toPreviousDate = () => {
        let index = 0;
        for (let i = 0; i < dndCalendar.length; i++) {
            const day = dndCalendar[i];
            if (day.date === this.date && day.month === this.month) {
                index = i;
                break;
            }
        }

        if (index === 0) {
            this._calendarDay = dndCalendar[dndCalendar.length - 1];
            this._year -= 1;
        } else {
            this._calendarDay = dndCalendar[index - 1];
        }

        this._date = this._calendarDay.date;
        this._month = this._calendarDay.month;
    }

    static getCalendarDay = (date: number, month: DnDMonth) => {
        const day = dndCalendar.find((dndDay: IDnDCalendarDay) => dndDay.date === date && dndDay.month === month);
        if (!day) throw new Error(`invalid DnDDate ${date} ${month}`);
        return day;
    }

    // requires format: DD MMM, YYYY RR
    static parseStringToDnDDate = (d = '1 Hammer, 1 DR'): [number, DnDMonth, number, Reckoning, IDnDCalendarDay] => {
        const [part1, part2] = d.split(',');
        const holiday = dndCalendar.find(d => d.holiday?.name === part1 || !!d.holiday?.alternativeNames?.find(a => a === part1));
        const [yearStr, reckoning] = part2.trim().split(' ');
        let date: number;
        let month: string;
        if (holiday) {        
            date = holiday.date;
            month = holiday.month;
        } else {
            const [dateStr, m] = part1.trim().split(' ');
            month = m;
            if (!dateStr || !yearStr) throw Error(`invalid DnDDate ${d}`);
            date = parseInt(dateStr);
        }
        
        const year = parseInt(yearStr);
        if (isNaN(year)) throw Error(`invalid DnDDate: ${d}`);

        const calendarDay = DnDDate.getCalendarDay(date, (month as DnDMonth));

        if (!Object.values(Reckoning).filter(r => r === reckoning).length) throw new Error(`invalid DnDDate ${d}`);

        return [date, (month as DnDMonth), year, (reckoning as Reckoning), calendarDay];
    }
}