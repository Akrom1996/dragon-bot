exports.delayTimeout = (seconds) => {
    return new Promise((resolve) =>
        setTimeout(() => {
            resolve();
        }, seconds ? seconds : Math.random()* 500),
    )
}