# open-source-licence-builder

open-source-licence-builder is a small project aimed at automatically building and defining best practices for open-source projects, and helping developers understand what is permitted within a repository.

run : 
```
npm run build-licence
```

licence.json
```json
{
  "licences": [
    {
      "licence": "licence",
      "params": {
        "copyright_author": "Proprietary License Owner",
        "year": "year,
        "custom_optional_param": "param
      },
      "file": {
        "includes": [
          "src"
        ],
        "excludes": [
          "src\\templates"
        ]
      },
      "custom_file_template": "{{licence}} -- by {{copyright_author}} in {{year}}",
      "custom_licence_template": "{{licence}} -- by {{copyright_author}} in {{year}} \nAll right reserved."
    }
  ]
}
```
