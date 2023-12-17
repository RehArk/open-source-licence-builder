// ----- LICENCE
// ----- This file is on MIT licence. Copyright (c) 2023-present RehArk.
// ----- for more details, please check {@link : https://github.com/RehArk/open-source-builder/blob/main/licences.md#1f7f3375-0c88-4118-a2f9-5e112a966761}
// ----- LICENCE

const fs = require('fs');
const path = require('path');

class FileProvider {

    constructor() {}

    /**
     * method : openFileLicence
     * 
     * description :
     * try to open a file to get data
     * 
     * @param {*} filePath 
     * @param {*} format 
     * @returns 
     */
    openFileLicence(filePath, format) {

        if (!fs.existsSync(filePath)) {
            console.log("!file : " + filePath);
            return false;
        }

        let data = null;

        try {
            data = fs.readFileSync(filePath, format);
        } catch (e) {
            throw("Can't open licences.json : somethig wrong append.");
        }
        
        return JSON.parse(data);

    }

    /**
     * method : createFileLicence
     * 
     * description :
     * create file licence
     * 
     * @param {*} filePath 
     * @param {*} data 
     * @param {*} format 
     * @param {*} indent 
     * @returns 
     */
    createFileLicence(
        filePath, 
        data,
        format,
        indent
    ) {

        try {
            fs.writeFileSync(filePath, JSON.stringify(data, null, indent), format);
        } catch {   
            throw "Can't create licences.json : somethig wrong append.";
        }

        return data;

    }

    /**
     * method : createFileLicence
     * 
     * description :
     * create file licence if not exist, else get data
     * 
     * @param {*} filePath 
     * @param {*} defaultContent 
     * @param {*} format 
     * @param {*} indent 
     * @returns 
     */
    readLicenseFile(
        filePath = 'licences.json', 
        defaultContent = {licences: [{licence: null, params: {}, file: {includes: [], excludes: []}}] },
        format = 'utf8',
        indent = 2
    ) {

        let data = null;

        try {
            data = this.openFileLicence(filePath, format);
        } catch {
            console.error("File licences.json not found, try to create new one...");
        }
    
        if(!data) {
            data = this.createFileLicence(filePath, defaultContent, format, indent);
        }

        return data;
        

    }

    /**
     * method : createFileLicence
     * 
     * description :
     * get all existing file path in a directory
     * 
     * @param {*} directoryPath 
     * @returns 
     */
    getFilePaths(directoryPath) {

        let filePaths = [];
    
        try {

            const stats = fs.statSync(directoryPath);

            if (stats.isFile()) {
                return [directoryPath];
            }
        
            const items = fs.readdirSync(directoryPath);

            items.forEach(item => {

                const itemPath = path.join(directoryPath, item);
                const stats = fs.statSync(itemPath);
            
                if (stats.isDirectory()) {
                    const subFiles = this.getFilePaths(itemPath);
                    filePaths = filePaths.concat(subFiles);
                } else if (stats.isFile()) {
                    filePaths.push(itemPath);
                }
                
            });

        } catch (err) {
            console.error("Error on getting path :", err);
        }
        
        return filePaths;
    
    }

}

module.exports = FileProvider;