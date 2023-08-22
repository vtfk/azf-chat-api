# azf-chat-api
Proxy api for sending and returning prompts from chatGPT 

## Usage and endpoints
### Endpoints
```
POST https://{base_url}/Response
```
#### Body
Example with no priorMessages
```json
{ 
    "isInitializing": true,
    "priorMessages": [],
    "message": "hei"
}
```
#### Response 
```json
{
	"role": "assistant",
	"content": "Hei! Jeg er en AI-drevet tekstgenerator som er her for å hjelpe deg med å svare på spørsmål eller gi deg informasjon om ulike emner. Jeg kan også hjelpe deg med å generere tekst til ulike formål, for eksempel forretningsdokumenter, blogginnlegg, artikler og mer. Bare still meg et spørsmål eller gi meg en instruksjon, så vil jeg gjøre mitt beste for å hjelpe deg!"
}
```

#### Body
Example with priorMessages
```json
{ 
	"isInitializing": false, 
	"priorMessages": [
        {
            "role": "assistant",
            "content": "Hei, jeg er en AI-drevet talegjenkjenningsteknologi. Jeg er utviklet for å konvertere tale til tekst og svare på spørsmål basert på den innsamlede informasjonen. Jeg kan brukes til å hjelpe med transkripsjon av lydopptak, assistere med diktering og bidra til å automatisere tekstbaserte oppgaver."
        },
        {
            "role": "user",
            "content": "Han du lage en liste for meg? "
        },
        {
            "role": "assistant",
            "content": "Selvfølgelig! Hva slags liste ønsker du? En handleliste, en gjøremålsliste, en ønskeliste eller noe annet? Vennligst gi meg litt mer informasjon, så hjelper jeg deg gjerne med å lage en liste."
        },
        {
            "role": "user",
            "content": "Du kan lage en handleliste, jeg skal ha ingredienser til en pizza til 4 personer. "
        },
        {
            "role": "assistant",
            "content": "Selvfølgelig! Her er en handleliste for å lage en pizza til 4 personer:\n\n- Pizzadeig\n- Pizzasaus\n- Mozzarella ost\n- Skinke\n- Pepperoni\n- Sopp\n- Paprika\n- Løk\n- Oliven\n- Basilikum (valgfritt)\n\nDette bør dekke de vanligste ingrediensene til en klassisk pizza. Husk at du også kan tilpasse toppingen etter egne preferanser. Lykke til med pizzabakingen!"
        }
    ], 
	"message": "Kan du bytte ut oliven med noe annet passende?" }
```
#### Response
```json
{
	"role": "assistant",
	"content": "Selvfølgelig! Hvis du ikke ønsker å bruke oliven, kan du erstatte det med noen andre passende ingredienser. Her er noen forslag til alternativer:\n\n- Fersk champignon\n- Fersk eller tørket basilikum\n- Ananasbiter (for en Hawaii-stil pizza)\n- Rød paprika\n- Cherrytomater\n- Artisjokkhjerter\n- Spinatblader\n\nDu kan velge en eller flere av disse ingrediensene, avhengig av dine preferanser. Ha det gøy med å lage pizzaen!"
}
```

It is important for you to provide the whole context for chatgpt if you want the corresponding message to be connected to the previous answers and questions.

## Local development
### Setup
1. Clone the project.
2. Install the Azure Functions Core Tools if you havent.
3. cd ``` <cd to the cloned project> ```.
4. run ```npm i``` in the terminal.
5. create a local.settings.json like below:

```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "OPENAI_API_KEY": "your-own-chatgpt-api-key",
    "OPENAI_MODEL":"the-open-api-model-you-want-to-use",
    "VALID_UPN_SUFFIX": "valid-suffix-if-you-want-to"
  },
  // Local cors
  "Host": {
    "LocalHttpPort": 7071,
    "CORS": "*"
  }
}  
```
6. Now you can run ``` func start ``` in the terminal.
7. Have fun 👍
### Azure function setup
NB! This step is not needed if you only want to test it localy without attaching it to the Svelte frontend.
1. You must have azure ad authentication enabled
2. An app registration representing the function must have the application permission "user_impersonation" and "User.Read"
3. The API then needs to get the correct role assigned for access.
