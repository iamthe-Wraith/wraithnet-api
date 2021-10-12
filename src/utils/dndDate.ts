import { dndCalendar } from "../../static/dnd-calendar";
import { IDnDCalendarDay } from "../types";
import CustomError from "./custom-error";

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

interface IDnDFullDate {
    date: IDnDCalendarDay;
    year: IDnDYear;
}

export class DnDDate {
    private _date: IDnDCalendarDay;
    private _year: IDnDYear;

    constructor (date = dndCalendar[0], year: IDnDYear = { num: 1, reckoning: Reckoning.DR }) {
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

    get year() {
        return this._year;
    }

    public setDate = (date: IDnDCalendarDay) => {
        this._date = date;
    }

    public setYear = (year: IDnDYear) => {
        this._year = year;
    }

    public stringify = () => {
        return `${this.date} ${this.month}, ${this.year.num} ${this.year.reckoning}`;
    }

    // requires format: DD MMM, YYYY RR
    static parse = (d: string): IDnDFullDate => {
        const [date, year] = d.split(',');
        const dateParsed = date.trim().split(' ');
        const yearParsed = year.trim().split(' ');
        const dndDate = dndCalendar.find(dndDay => dndDay.date === parseInt(dateParsed[0]) && dndDay.month === dateParsed[1]);
        const dndYear: IDnDYear = { num: parseInt(yearParsed[0]), reckoning: yearParsed[1] as Reckoning };

        if (!dndDate || isNaN(dndYear.num)) throw new CustomError('invalid dnd date');

        return {
            date: dndDate,
            year: dndYear,
        };
    }
}