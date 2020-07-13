import { of } from 'rxjs';
export class DataService {
    // protected _cache:any[];
    // protected _cacheAge = new Date();
    readonly _maxAge = 86400000;
    protected _caches = [];

    constructor() { }

    protected checkExpiration(dataName){
      if (!this._caches[dataName] || !this._caches[dataName]._cacheAge){
        return false
      }
      else {
        return new Date().valueOf() - this._caches[dataName]._cacheAge.valueOf() < this._maxAge;
      }
    }

    protected cache(dataName, data) {
      this._caches[dataName] = {_cache: data, _cacheAge: new Date()}

        // Create setters and getters for the new cache property, this is ES5 syntax not typescript
        // The setter method is created such that it supports editing the cache value without the cacheAge resetting
        Object.defineProperty(this, dataName, {
          configurable:true,
          get: () => { return of(this._caches[dataName]._cache); },
          // set: (value, key?) => {
          //   if (key){
          //     this._caches[dataName] = { _cache: {key: value}, cacheAge: this._caches[dataName._cacheAge]}
          //   }else{
          //     this._caches[dataName] = { _cache: value, _cacheAge: this._caches[dataName]._cacheAge }
          //   }
          // },
        });

    }

    public refresh(key?:string) {
      if(key){
        this._caches[key]._cacheAge = null;
      }else{
        for (let cache in this._caches){
          this._caches[cache]._cacheAge = null;
        }
      }
    }
}
