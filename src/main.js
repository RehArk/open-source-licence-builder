// ----- LICENCE
// ----- This file is on MIT licence. Copyright (c) 2023-present RehArk.
// ----- for more details, please check {@link : https://github.com/RehArk/open-source-builder/blob/main/licences.md#1f7f3375-0c88-4118-a2f9-5e112a966761}
// ----- LICENCE

const FileProvider = require('./FileProvider');
const TemplateManager = require('./TemplateManager');
const { v4: uuidv4 } = require('uuid');
const gitconfig = require('gitconfiglocal');



gitconfig('./', function (err, config) {

    let git_url = "";

    if (!err && config && config.remote && config.remote.origin && config.remote.origin.url) {
        const repoURL = config.remote.origin.url;
        git_url = repoURL.replace(".git", "");
        git_url += "/blob/main/";
    }

    console.log(git_url);

    let fileProvider = new FileProvider();
    const licenseContent = fileProvider.readLicenseFile();

    if(licenseContent.licences.length == 0) {
        throw "No licence defined";
    }

    let templateManager = new TemplateManager(git_url);
    templateManager.rebuildLicenceFile(licenseContent.licenceHeader ?? "");

    for(const index in licenseContent.licences) {

        const licence = licenseContent.licences[index];

        if(!licence.licence || licence.licence == "") {
            throw "Licence name undefined";
        }

        licence.uuid = uuidv4();

        templateManager.addLicence(licence);
        templateManager.applyFileHeader(licence);

    }

});
