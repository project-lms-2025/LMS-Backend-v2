const setTable = (req, res, next) => {
    const series_id = req.body.series_id;
    const course_id = req.body.course_id;
    const test_type = req.body.test_type || req.query.test_type || req.params.test_type;
    if (!test_type || !['course', 'series'].includes(test_type)) {
      return res.status(400).json({
        message: 'Invalid test type. Must be either "course" or "series"'
      });
    }

    // If it's a series test, validate series_id
    if (test_type === 'series' && !series_id) {
      return res.status(400).json({
        message: 'series_id is required for series tests'
      });
    }

    // If it's a course test, validate course_id
    if (test_type === 'course' && !course_id) {
      return res.status(400).json({
        message: 'course_id is required for course tests'
      });
    }
    
    if (test_type === 'series') {
      req.table_name = 'ts_';
    } else {
      req.table_name = '';
    }

    next();
  }
  
export default setTable;
  