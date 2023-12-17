// ----- LICENCE
// ----- This file is on MIT licence. Copyright (c) 2023-present RehArk.
// ----- for more details, please check {@link : https://github.com/RehArk/open-source-builder/blob/main/licences.md#1f7f3375-0c88-4118-a2f9-5e112a966761}
// ----- LICENCE

const fs = require('fs');
const path = require('path');

class TemplateBuilder {

    constructor(git_url) {
        this.git_url = git_url;
        this.pattern = "// ----- LICENCE";
        this.file_header_template = 'This file is on {{licence_name}} licence. Copyright (c) {{year}} {{copyright_author}}.';
    }

    /**
     * method : setTemplateParams
     * 
     * description :
     * replace all tag in a template and return it
     * 
     * @param {*} licence 
     * @param {*} template 
     * @returns string formated_template
     */
    setTemplateParams(licence, template) {

        return template.replace(/{{(.*?)}}/g, (match, p1) => {

            if(p1 == "licence_name") {
                return licence.licence
            }

            if(p1 == "licence_uuid") {
                return licence.uuid;
            }
            
            if (licence.params[p1]) {
                return licence.params[p1];
            }
            
            return match;
            
        });

    }


    /* ----- Licence template -----*/

    /**
     * method : getLicenceTemplate
     * 
     * description :
     * get matching temlpate with the licence, it could be define by default if exist,
     * else it could be a custom template with tag {{custom_licence_template}}
     * 
     * @param {*} licence 
     * @returns string template
     */
    getLicenceTemplate(licence) {

        let template = null;

        if(licence.custom_licence_template) {
            template = licence.custom_licence_template;
            return template;
        }
        
        try{
            const relativeFilePath = path.join(__dirname, 'templates', licence.licence.toLowerCase() + '.template');
            template = fs.readFileSync(relativeFilePath, "utf-8");
        } catch {
            throw licence.licence + ' template not found.';
        }

        return template;

    }

    /**
     * method : buildLicence
     * 
     * description :
     * get matching temlpate with the licence, and build it with tags
     * 
     * @param {*} licence 
     * @returns string formated_template
     */
    buildLicence(licence) {
        
        let template = this.getLicenceTemplate(licence);

        const template_result = this.setTemplateParams(licence, template);

        return template_result;

    }

    /* ----- File template -----*/

    /**
     * method : getFileTemplate
     * 
     * description :
     * get matching temlpate with the licence, it could be define by default if exist,
     * else it could be a custom template with tag {{custom_file_template}}
     * 
     * @param {*} licence 
     * @returns string template
     */
        getFileTemplate(licence) {

            let custom_file_template = null;
    
            if(licence.custom_file_template) {
                custom_file_template = licence.custom_file_template;
            }

            if(custom_file_template == null || custom_file_template == "") {
                custom_file_template = this.file_header_template;
            }

            custom_file_template =
                this.pattern + "\n" + 
                "// ----- " + custom_file_template + "\n" +
                "// ----- " + "for more details, please check {@link : " + this.git_url + "licences.md#" + licence.uuid + "}" + "\n" + 
                this.pattern
            ;
    
            return custom_file_template;
    
        }

    /**
     * method : buildLinesForBeginning
     * 
     * description :
     * get matching temlpate with the licence, and build it with tags
     * 
     * @param {*} licence 
     * @param {*} extension 
     * @returns string formated_template
     */
    buildLinesForBeginning(licence, extension) {

        let custom_file_template = this.getFileTemplate(licence);

        const file_template_result = this.setTemplateParams(licence, custom_file_template);

        return file_template_result;

    }

}

module.exports = TemplateBuilder;