export class Query {
    _limit = 10;
    _skip = 0;
    _filter
    _total = 0;
    _sort;

    get limit() {
        return this._limit;
    }

    withLimit(newValue) {
        this._limit = newValue;
        return this;
    }

    get skip() {
        return this._skip;
    }

    withSkip(number) {
        this._skip = number;
        return this;
    }

    withFilter(filter) {
        this._filter = filter;
        return this;
    }

    get filter() {
        return this._filter?.build();
    }

    goto(number) {
        this._skip = this._limit * (number - 1);
    }

    gotoOffset(number) {
        this._skip += this._limit * number;
    }

    onTotal(number) {
        this._total = number;
    }

    get maxPage() {
        return Math.floor((this._total - 1) / this._limit + 1);
    }

    get sort() {
        return this._sort?.build();
    }

    withSort(sort) {
        this._sort = sort;
        return this;
    }
}