import {Query} from "../src/Query";
import {and, asc, equals} from "../src/DslQueryBuilder";

describe('query builder', function () {
    it('should return empty query', function () {
        let query = new Query();
        expect(query.limit).toBe(10);
        expect(query.skip).toBe(0);
    });

    it('set query limit ', function () {
        let query = new Query().withLimit(12);
        expect(query.limit).toBe(12);
    });

    it('set query skip', function () {
        let query = new Query().withSkip(12);
        expect(query.skip).toBe(12);
    });

    it('set query filter', function () {
        let query = new Query().withFilter(and(equals("name", "bob")))
        expect(query.filter).toEqual("(and(name equals bob))")
    });

    it('should set skip when go to page', function () {
        let query = new Query();
        query.goto(10);
        expect(query.skip).toBe(90)
    });

    it('should set skip when go offset', function () {
        let query = new Query();
        query.goto(10);
        query.gotoOffset(-1);
        expect(query.skip).toBe(80)
    });

    it('should return total pages when have total1', function () {
        let query = new Query();
        query.onTotal(219);
        expect(query.maxPage).toEqual(22);
    });

    it('should return total pages when have total2', function () {
        let query = new Query();
        query.onTotal(210);
        expect(query.maxPage).toEqual(21);
    });

    it('filter should be undefined', function () {
        let query = new Query();
        expect(query.filter).toBeUndefined()
    });

    it('should sort be empty', function () {
        expect(new Query().sort).toBeUndefined()
    });

    it('should has sort', function () {
        expect(new Query().withSort(asc("name")).sort).toEqual("name asc");
    });
});