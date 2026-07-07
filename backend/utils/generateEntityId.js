const Counter = require("../models/Counter")

const generateEntityId = async(counterName, prefix) => {
    const counter = await Counter.findOneAndUpdate(
        { name: counterName },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
    )

    return `${prefix}${String(counter.value).padStart(3, "0")}`
}

module.exports = generateEntityId