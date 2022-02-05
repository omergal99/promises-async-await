import { myPromiseAllSettled } from './myPromises.js'

const sleepReject = (ms) => {
    return new Promise((_, reject) => {
        setTimeout(() => {
            console.log('reject', ms)
            return reject(new Error(`Faild task ms=${ms}`));
        }, ms);
    })
};

const sleepResolve = (ms) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('resolve', ms)
            return resolve(ms);
        }, ms);
    })
};

const getPromise1 = () => sleepReject(1000);
const getPromise2 = () => sleepResolve(500);
const getPromise3 = () => sleepResolve(1500);
const getPromiseList = () => [getPromise1(), getPromise2(), getPromise3()];

const thenCatchFunction = () => {
    const promisesRes = [];
    return getPromise1().then(res => {
        promisesRes.push(res);
        return getPromise2().then(res => {
            promisesRes.push(res);
            return getPromise3().then(res => {
                promisesRes.push(res);
                return promisesRes;
            }).catch(err => {
                throw err;
            })
        }).catch(err => {
            throw err;
        })
    }).catch(err => {
        throw err;
    })
}

const asyncAwaitFunction = async () => {
    let promisesRes = [];
    const promise1 = getPromise1();
    const promise2 = getPromise2();
    const promise3 = getPromise3();
    try {
        const promise1Res = await promise1;
        promisesRes.push(promise1Res);
    } catch (err) {
        promisesRes.push(err);
    }
    try {
        const promise2Res = await promise2;
        promisesRes.push(promise2Res);
    } catch (err) {
        promisesRes.push(err);
    }
    try {
        const promise3Res = await promise3;
        promisesRes.push(promise3Res);
    } catch (err) {
        promisesRes.push(err);
    }
    return promisesRes;
}

// implement Promise.allSettled using Promise.All
const promiseAllFunction = async () => {
    let promisesRes, promiseRejError;
    try {
        // promisesRes async await
        promisesRes = await Promise.all(getPromiseList().map(async promise => {
            try {
                const res = await promise;
                return { status: 'fulfilled', value: res, };
            } catch (err) {
                return { status: 'rejected', reason: err, };
            }
        }));
        // // promisesRes .then().catch()
        // promisesRes = await Promise.all(getPromiseList().map(promise => {
        //     return promise
        //         .then(res => { return { status: 'fulfilled', value: res, } })
        //         .catch((err) => { return { status: 'rejected', reason: err, } })
        // }));
    } catch (err) { // handle the catch if one faild and there is no catch for him
        promiseRejError = err;
        console.log({ err });
        throw err;
    } finally {
        if (promiseRejError) {
            return promiseRejError;
        }
        return promisesRes;
    }
}

const promiseAllSettledFunction = async () => {
    let promisesRes, promiseRejError;
    try {
        promisesRes = await Promise.allSettled(getPromiseList());
    } catch (err) {
        promiseRejError = err;
        console.log({ err });
        throw err;
    } finally {
        if (promiseRejError) {
            return promiseRejError
            // throw promiseRejError;
        }
        return promisesRes;
    }
}

const init = async () => {
    const tasks = [
        thenCatchFunction,
        asyncAwaitFunction,
        promiseAllFunction,
        promiseAllSettledFunction,
    ].map(task => {
        return task();
    })

    const res = await myPromiseAllSettled(tasks);
    console.log('res', { res }); // TODO: remove log

}
init()
