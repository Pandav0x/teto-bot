import DateTimeFormatter from "../src/utils/DateTimeFormatter";
import { expect } from "chai";

describe('DateTimeFormatter Tests.', () => {
    let dtf: DateTimeFormatter;

    beforeEach(()=> {
        dtf = new DateTimeFormatter();
    })

    it('timeTo24Hours()', () => {
        expect(dtf.timeTo24Hours('7pm')).to.be.equals('19:00');
        expect(dtf.timeTo24Hours('6am')).to.be.equals('06:00');
        expect(dtf.timeTo24Hours('07pm')).to.be.equals('19:00');
        expect(dtf.timeTo24Hours('06am')).to.be.equals('06:00');
        /*expect(dtf.timeTo24Hours('8:30pm')).to.be.equals('20:30');
        expect(dtf.timeTo24Hours('8:25pm')).to.be.equals('20:25');
        expect(dtf.timeTo24Hours('3:30am')).to.be.equals('03:30');
        expect(dtf.timeTo24Hours('3:25am')).to.be.equals('03:25');
        expect(dtf.timeTo24Hours('16:00')).to.be.equals('16:00');
        expect(dtf.timeTo24Hours('09:00')).to.be.equals('09:00');*/
    });

    it('timeTo12Hours()', () => {
        
    });
});