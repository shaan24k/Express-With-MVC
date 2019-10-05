const path = require('path'),
      config = require('config'), 
      multer = require('multer'),
      express = require('express'),
      router = express.Router(),
      middleWare = require(path.resolve(config.get('app.middlewareDir'),'validation'));
      packageController = require(path.resolve(config.get('app.controllerDir'),'packageController'));

try {

    let upload = multer({ storage: multer.memoryStorage() });

    router.post('/add_package',upload.array('imageAndVideoFiles[]'), middleWare.PackageValidation, packageController.addPackage);
    router.get('/all_packages', packageController.getAllPackagesList);
    router.get('/package_detail', middleWare.PackageIdValidation, packageController.getPackageDetail);
    router.put('/update_package',upload.array('imageAndVideoFiles[]'), middleWare.updatePackageValidation, packageController.updatePackage);
    router.delete('/delete_package', middleWare.PackageIdValidation, packageController.deletePackage);

} catch(e) {

    return failure_callback(res, [e.message, 500]);

}

module.exports = router;