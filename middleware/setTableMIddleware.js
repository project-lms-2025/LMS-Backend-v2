const setTable = (req, res, next) => {
    const test_type = req.body.test_type || req.query.test_type || req.params.test_type;
    
    if (test_type === 'series') {
      req.table_name = 'ts_';
    } else {
      req.table_name = '';
    }

    next();
  }
  
export default setTable;
  