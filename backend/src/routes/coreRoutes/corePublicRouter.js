const express = require('express');

const router = express.Router();
const path = require('path');

// Without middleware

router.route('/:subPath/:directory/:file').get(function (req, res) {
  try {
    const { subPath, directory, file } = req.params;

    // Each URL parameter must remain one path segment, on Windows and Unix.
    const invalidSegment = [subPath, directory, file].some(
      (segment) => !segment || segment === '.' || segment === '..' || /[\/\\\0]/.test(segment)
    );
    if (invalidSegment) {
      return res.status(400).json({ success: false, message: 'Invalid path' });
    }

    const options = {
      root: path.join(__dirname, `../../public/${subPath}/${directory}`),
    };
    const fileName = file;
    res.sendFile(fileName, options, function (error) {
      if (error) {
        res.status(404).json({
          success: false,
          result: null,
          message: 'we could not find : ' + file,
        });
      }
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      result: null,
      message: error.message,
      error: error,
    });
  }
});

module.exports = router;
