# Kids Savings

La idea es que desde una google spreadsheet se:

- Define el periodo y el monto a acreditar de forma periodica
- Se calcula el balance y almacenan los movimientos de la cuenta
- Se almacena una pregunta y una respuesta que permiten el acceso a esta info.

Existe un programa (python) que accede periodicamente a la spreadsheet y genera dos archivos que se almacenan en un hosting que no permite listar sino acceso directo (nginx o S3)

- Archivo publico con la pregunta actual `question.json`
- Archivo balance cuyo nombre es el sha256sum de la respuesta a la pregunta secreta



```
echo -n "lola" | sha256sum --text 
47acf82a48cfa5c340ea536cdd66c75ef85eb8d3fcff468fc7c8abcaceb15ed0  -
```