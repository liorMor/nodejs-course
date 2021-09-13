const advancedResults = (model, populate) => async(req, res, next) => {
    const reqQuery = { ...req.query };
    //fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(f => delete reqQuery[f]);
    //create query string
    let queryStr = JSON.stringify(reqQuery);
    //create operators
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    let query = model.find(JSON.parse(queryStr));
    //select
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }
    //sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }
    //pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();
    query = query.skip(startIndex).limit(limit);

    //finding resource
    if (populate) {
        query = query.populate(populate);
    }

    const results = await query;
    //pagination results
    const pagination = {};
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page -1,
            limit
        }
    }

    res.advancedResults = {
        succes: true,
        count: results.count,
        pagination,
        data: results 
    }
    next();
}

module.exports = advancedResults;