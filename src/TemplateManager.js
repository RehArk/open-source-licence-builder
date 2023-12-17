// ----- LICENCE
// ----- This file is on MIT licence. Copyright (c) 2023-present RehArk.
// ----- for more details, please check {@link : https://github.com/RehArk/open-source-builder/blob/main/licences.md#1f7f3375-0c88-4118-a2f9-5e112a966761}
// ----- LICENCE

const fs = require('fs');
const FileProvider = require('./FileProvider');
const TemplateBuilder = require('./TemplateBuilder');

class TemplateManager {

    constructor(git_url) {
        this.templateBuilder = new TemplateBuilder(git_url);
        this.pattern = '// ----- LICENCE';
        this.licences_md = "licences.md";
        this.format = "utf8"
    }

    /* ----- licence file ----- */

    /**
     * method : rebuildLicenceFile
     * 
     * description :
     * clear licences.md file to rebuild all licences
     * 
     */
    rebuildLicenceFile(licenceHeader) {

        if(licenceHeader == "") {
            licenceHeader = "This file contain all licence information";
        }

        licenceHeader = 
            "Licensing Information User Manual" + "\n\n" +
            "======================================================================" + "\n\n" +
            licenceHeader + "\n"
        ;

        fs.writeFile(this.licences_md, licenceHeader, this.format, (writeErr) => {

            if (writeErr) {
                console.log("Can't edit file : " + writeErr);
                return;
            }

        });

    }

    /**
     * method : addLicence
     * 
     * description :
     * add formated template licence in licences.md
     * 
     * @param {*} licence 
     */
    addLicence(licence) {
        const template_result = this.templateBuilder.buildLicence(licence);
        this.writeInFile(this.licences_md, template_result)
    }

    /**
     * method : writeInFile
     * 
     * description :
     * add text to a file
     * 
     * @param {*} filePath 
     * @param {*} textToAdd 
     */
    writeInFile(filePath, textToAdd) {

        textToAdd = 
            "\n" +
            "======================================================================" + "\n" +
            "======================================================================" + "\n" +
            "\n" + textToAdd + "\n"
        ;

        const readStream = fs.createReadStream(filePath, { encoding: this.format });
        const writeStream = fs.createWriteStream(filePath, { flags: 'a' }); // 'a' pour append (ajout)

        readStream.on('error', err => {
            console.log("Can't read file : " + filePath + "\nerror : " + err);
        });

        writeStream.on('error', err => {
            console.log("Can't edit file : " + filePath + "\nerror : " + err);
        });

        readStream.pipe(writeStream, { end: false });
        writeStream.write(textToAdd, this.format);
        writeStream.end();

    }

    /* ----- file header ----- */

    /**
     * 
     * method : applyFileHeader
     * 
     * description :
     * add file header for all files included
     * 
     * @param {*} licence 
     */
    applyFileHeader(licence) {

        let fileProvider = new FileProvider();

        let includes = []
        
        for(let path of licence.file.includes) {
            let paths = fileProvider.getFilePaths(path)
            includes = [...new Set([...includes, ...paths])];
        }
    
        for(let path of licence.file.excludes) {
            let paths = fileProvider.getFilePaths(path)
            includes = includes.filter(item => !paths.includes(item));
        }
    
        const line = this.templateBuilder.buildLinesForBeginning(licence);

        for(let path of includes) {
            this.removeOldFileTemplate(path, () => {
                this.addNewFileTemplate(path, line)
            });
        }

    }

    /**
     * method : addNewFileTemplate
     * 
     * description :
     * add file header for a file
     * 
     * @param {*} filePath 
     * @param {*} newLine 
     * @param {*} callback 
     */
    addNewFileTemplate(filePath, newLine, callback = () => {}) {

        fs.readFile(filePath, this.format, (err, data) => {

            if (err) {
                console.log("Can't read file : " + filePath)
            }
            
            const newData = newLine + data;
        
            fs.writeFile(filePath, newData, this.format, (writeErr) => {

                if (writeErr) {
                    console.log("Can't edit file : " + filePath + "\nerror : " + writeErr);
                    return;
                }

                callback();

            });

        });

    }

    /**
     * method : removeOldFileTemplate
     * 
     * description :
     * remove file header for a file
     * 
     * @param {*} filePath 
     * @param {*} callback 
     */
    removeOldFileTemplate(filePath, callback = () => {}) {

        fs.readFile(filePath, this.format, (err, data) => {

            if (err) {
              console.error("Can't read file : " + filePath + "\nerror : " + err);
              return;
            }

            const startIndex = data.indexOf(this.pattern);
            const endIndex = data.indexOf(this.pattern, startIndex + this.pattern.length);

            console.log(startIndex, endIndex)

            if(startIndex !== 0) {
                return callback();;
            }
                      
            if (startIndex === -1 || endIndex === -1) {
                return callback();;
            }

            const newData = data.slice(0, startIndex) + data.slice(endIndex + this.pattern.length);
        
            fs.writeFile(filePath, newData, this.format, (writeErr) => {

                if (writeErr) {
                    console.error("Can't write in file : " + filePath + "\nerror : " + err);
                    return;
                }

                callback();

            });

        });

    }

}

module.exports = TemplateManager;