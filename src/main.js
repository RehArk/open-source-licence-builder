// ----- LICENCE
// ----- This file is on MIT licence.
// ----- LICENCE

const FileProvider = require('./FileProvider');
const TemplateManager = require('./TemplateManager');

let fileProvider = new FileProvider();
const licenseContent = fileProvider.readLicenseFile();

if(licenseContent.licences.length == 0) {
    throw "No licence defined";
}

let templateManager = new TemplateManager();
templateManager.rebuildLicenceFile(licenseContent.licenceHeader ?? "");

for(const index in licenseContent.licences) {

    const licence = licenseContent.licences[index];

    if(!licence.licence || licence.licence == "") {
        throw "Licence name undefined";
    }

    templateManager.addLicence(licence);
    templateManager.applyFileHeader(licence);

}
