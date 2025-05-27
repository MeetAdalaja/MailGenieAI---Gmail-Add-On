// Homepage: Mode Selection
function showHomePage(e) {
  Logger.log("showHomePage called");
  const card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader()
      .setTitle("MailGenie AI")
      .setSubtitle("AI-Powered Email Assistant"));

  const modeSection = CardService.newCardSection()
    .setHeader("Select Mode")
    .addWidget(CardService.newButtonSet()
      .addButton(CardService.newTextButton()
        .setText("Compose")
        .setOnClickAction(CardService.newAction().setFunctionName("showComposeCard")))
      .addButton(CardService.newTextButton()
        .setText("Reply")
        .setOnClickAction(CardService.newAction().setFunctionName("showReplyCard"))));

  card.addSection(modeSection);
  return [card.build()];
}

// Scenario Helper Functions
function getScenarios() {
  return JSON.parse(PropertiesService.getUserProperties().getProperty("scenarios") ||
    '["Job Application","Deadline Extension Request","Project Proposal","Meeting Reschedule","Leave Request","Feedback Submission","Budget Approval","Resource Allocation","Event Registration","Training Request","Others"]');
}

function saveScenarios(scenarios) {
  PropertiesService.getUserProperties().setProperty("scenarios", JSON.stringify(scenarios));
}

function buildScenarioSection(e) {
  Logger.log("buildScenarioSection called");
  const section = CardService.newCardSection().setHeader("Scenario");
  const scenarios = getScenarios();

  const scenarioDropdown = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.DROPDOWN)
    .setFieldName("scenario")
    .setTitle("Scenario Selection")
    .setOnChangeAction(CardService.newAction()
      .setFunctionName("handleScenarioChange"));

  scenarios.forEach(scenario => {
    const isSelected = !!(e.formInput && e.formInput.scenario === scenario);
    scenarioDropdown.addItem(scenario, scenario, isSelected);
  });

  section.addWidget(scenarioDropdown);

  if (e.formInput && e.formInput.scenario === "Others") {
    section
      .addWidget(CardService.newTextInput()
        .setFieldName("customScenario")
        .setTitle("Custom Scenario")
        .setHint("Enter new scenario name")
        .setValue(e.formInput.customScenario || ""))
      .addWidget(CardService.newButtonSet()
        .addButton(CardService.newTextButton()
          .setText("Save")
          .setOnClickAction(CardService.newAction()
            .setFunctionName("saveNewScenario")))
        .addButton(CardService.newTextButton()
          .setText("Edit/Delete")
          .setOnClickAction(CardService.newAction()
            .setFunctionName("showEditDeleteCard"))));
  } else {
    section.addWidget(CardService.newButtonSet()
      .addButton(CardService.newTextButton()
        .setText("Add Scenario")
        .setOnClickAction(CardService.newAction()
          .setFunctionName("showAddScenarioCard")))
      .addButton(CardService.newTextButton()
        .setText("Edit/Delete")
        .setOnClickAction(CardService.newAction()
          .setFunctionName("showEditDeleteCard"))));
  }

  return section;
}

// Compose Mode Card
function showComposeCard(e) {
  Logger.log("showComposeCard called");
  const card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle("Compose Email"));

  const scenarioSection = buildScenarioSection(e);

  const inputsSection = CardService.newCardSection()
    .setHeader("Email Details")
    .addWidget(CardService.newTextInput()
      .setFieldName("recipientDetails")
      .setTitle("Recipient Details")
      .setHint("e.g., John Doe, HR Manager"))
    .addWidget(CardService.newTextInput()
      .setFieldName("additionalInfo")
      .setTitle("Additional Info")
      .setHint("e.g., specific details"))
    .addWidget(CardService.newSelectionInput()
      .setType(CardService.SelectionInputType.RADIO_BUTTON)
      .setFieldName("style")
      .setTitle("Style")
      .addItem("Normal", "Normal", true)
      .addItem("Professional", "Professional", false)
      .addItem("Casual", "Casual", false))
    .addWidget(CardService.newSelectionInput()
      .setType(CardService.SelectionInputType.RADIO_BUTTON)
      .setFieldName("tone")
      .setTitle("Tone")
      .addItem("Normal", "Normal", true)
      .addItem("Formal", "Formal", false)
      .addItem("Friendly", "Friendly", false))
    .addWidget(CardService.newSelectionInput()
      .setType(CardService.SelectionInputType.RADIO_BUTTON)
      .setFieldName("creativityLevel")
      .setTitle("Creative Level")
      .addItem("Straightforward", "Straightforward", true)
      .addItem("Somewhat Creative", "Somewhat Creative", false)
      .addItem("Quite Creative", "Quite Creative", false))
    .addWidget(CardService.newTextInput()
      .setFieldName("language")
      .setTitle("Language")
      .setValue("English"));

  const storedValue = PropertiesService.getUserProperties().getProperty("useEmojis");
  const useEmojis = storedValue === "true";

  const toggleSection = CardService.newCardSection()
    .setHeader("Options")
    .addWidget(CardService.newSelectionInput()
      .setType(CardService.SelectionInputType.CHECK_BOX)
      .setFieldName("emojiToggle")
      .addItem("Use Emojis", "useEmojis", useEmojis)
      .setOnChangeAction(CardService.newAction()
        .setFunctionName("toggleEmojiFeedback")
        .setParameters({ pageMode: "compose" }))); // Add pageMode parameter

  const actionSection = CardService.newCardSection()
    .addWidget(CardService.newTextButton()
      .setText("Generate Draft")
      .setOnClickAction(CardService.newAction()
        .setFunctionName("generateEmail")
        .setParameters({ pageMode: "compose" }))); // Optional: propagate to generateEmail if needed

  card.addSection(scenarioSection)
    .addSection(inputsSection)
    .addSection(toggleSection)
    .addSection(actionSection);

  return [card.build()];
}

// Reply Mode Card
function showReplyCard(e) {
  Logger.log("showReplyCard called");
  const card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle("Reply to Email"));

  const replySection = CardService.newCardSection()
    .setHeader("Reply Details")
    .addWidget(CardService.newTextInput()
      .setFieldName("replyEmail")
      .setTitle("Email to Reply To")
      .setMultiline(true)
      .setHint("Paste the email here"))
    .addWidget(CardService.newSelectionInput()
      .setType(CardService.SelectionInputType.RADIO_BUTTON)
      .setFieldName("responseChoice")
      .setTitle("Response Choice")
      .addItem("Positive", "Positive", true)
      .addItem("Negative", "Negative", false));

  const inputsSection = CardService.newCardSection()
    .setHeader("Email Details")
    .addWidget(CardService.newTextInput()
      .setFieldName("recipientDetails")
      .setTitle("Recipient Details")
      .setHint("e.g., John Doe, HR Manager"))
    .addWidget(CardService.newTextInput()
      .setFieldName("additionalInfo")
      .setTitle("Additional Info")
      .setHint("e.g., specific details"))
    .addWidget(CardService.newSelectionInput()
      .setType(CardService.SelectionInputType.RADIO_BUTTON)
      .setFieldName("style")
      .setTitle("Style")
      .addItem("Normal", "Normal", true)
      .addItem("Professional", "Professional", false)
      .addItem("Casual", "Casual", false))
    .addWidget(CardService.newSelectionInput()
      .setType(CardService.SelectionInputType.RADIO_BUTTON)
      .setFieldName("tone")
      .setTitle("Tone")
      .addItem("Normal", "Normal", true)
      .addItem("Formal", "Formal", false)
      .addItem("Friendly", "Friendly", false))
    .addWidget(CardService.newSelectionInput()
      .setType(CardService.SelectionInputType.RADIO_BUTTON)
      .setFieldName("creativityLevel")
      .setTitle("Creative Level")
      .addItem("Straightforward", "Straightforward", true)
      .addItem("Somewhat Creative", "Somewhat Creative", false)
      .addItem("Quite Creative", "Quite Creative", false))
    .addWidget(CardService.newTextInput()
      .setFieldName("language")
      .setTitle("Language")
      .setValue("English"));

  const storedValue = PropertiesService.getUserProperties().getProperty("useEmojis");
  const useEmojis = storedValue === "true";

  const toggleSection = CardService.newCardSection()
    .setHeader("Options")
    .addWidget(CardService.newSelectionInput()
      .setType(CardService.SelectionInputType.CHECK_BOX)
      .setFieldName("emojiToggle")
      .addItem("Use Emojis", "useEmojis", useEmojis)
      .setOnChangeAction(CardService.newAction()
        .setFunctionName("toggleEmojiFeedback")
        .setParameters({ pageMode: "reply" }))); // Add pageMode parameter

  const actionSection = CardService.newCardSection()
    .addWidget(CardService.newTextButton()
      .setText("Generate Draft")
      .setOnClickAction(CardService.newAction()
        .setFunctionName("generateEmail")
        .setParameters({ pageMode: "reply" }))); // Optional: propagate to generateEmail if needed

  card.addSection(replySection)
    .addSection(inputsSection)
    .addSection(toggleSection)
    .addSection(actionSection);

  return [card.build()];
}

// Scenario Management Functions
function handleScenarioChange(e) {
  Logger.log("handleScenarioChange called with scenario: " + e.formInput.scenario);
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().updateCard(showComposeCard(e)[0]))
    .build();
}

function saveNewScenario(e) {
  Logger.log("saveNewScenario called");
  const newScenario = e.formInput.customScenario;

  if (!newScenario || newScenario.trim() === "") {
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText("Please enter a scenario name"))
      .build();
  }

  let scenarios = getScenarios();
  const trimmedScenario = newScenario.trim();

  if (scenarios.some(s => s.toLowerCase() === trimmedScenario.toLowerCase())) {
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText("This scenario already exists"))
      .build();
  }

  const othersIndex = scenarios.indexOf("Others");
  if (othersIndex !== -1) {
    scenarios.splice(othersIndex, 0, trimmedScenario);
  } else {
    scenarios.push(trimmedScenario);
  }

  saveScenarios(scenarios);

  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().updateCard(showComposeCard(e)[0]))
    .setNotification(CardService.newNotification()
      .setText("Scenario saved successfully"))
    .build();
}

function showAddScenarioCard(e) {
  Logger.log("showAddScenarioCard called");
  const card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle("Add Scenario"));

  const section = CardService.newCardSection()
    .addWidget(CardService.newTextInput()
      .setFieldName("newScenario")
      .setTitle("New Scenario")
      .setHint("Enter new scenario name"))
    .addWidget(CardService.newButtonSet()
      .addButton(CardService.newTextButton()
        .setText("Add")
        .setOnClickAction(CardService.newAction()
          .setFunctionName("addNewScenarioFromCard")))
      .addButton(CardService.newTextButton()
        .setText("Back")
        .setOnClickAction(CardService.newAction()
          .setFunctionName("returnToComposeCard"))));

  card.addSection(section);
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().pushCard(card.build()))
    .build();
}

function addNewScenarioFromCard(e) {
  Logger.log("addNewScenarioFromCard called");
  const newScenario = e.formInput.newScenario;

  if (!newScenario || newScenario.trim() === "") {
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText("Please enter a scenario name"))
      .build();
  }

  let scenarios = getScenarios();
  const trimmedScenario = newScenario.trim();

  if (scenarios.some(s => s.toLowerCase() === trimmedScenario.toLowerCase())) {
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText("This scenario already exists"))
      .build();
  }

  const othersIndex = scenarios.indexOf("Others");
  if (othersIndex !== -1) {
    scenarios.splice(othersIndex, 0, trimmedScenario);
  } else {
    scenarios.push(trimmedScenario);
  }

  saveScenarios(scenarios);

  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation()
      .popToRoot()
      .updateCard(showComposeCard(e)[0]))
    .setNotification(CardService.newNotification()
      .setText("Scenario added successfully"))
    .build();
}

function showEditDeleteCard(e) {
  Logger.log("showEditDeleteCard called");
  const card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle("Edit/Delete Scenarios"));

  const section = CardService.newCardSection();
  let scenarios = getScenarios();
  const editableScenarios = scenarios.filter(s => s !== "Others");

  if (editableScenarios.length === 0) {
    section.addWidget(CardService.newTextParagraph()
      .setText("No editable scenarios available."));
  } else {
    editableScenarios.forEach((scenario, index) => {
      section
        .addWidget(CardService.newTextInput()
          .setFieldName(`scenario_${index}`)
          .setTitle(`Scenario ${index + 1}`)
          .setValue(scenario))
        .addWidget(CardService.newButtonSet()
          .addButton(CardService.newTextButton()
            .setText("Update")
            .setOnClickAction(CardService.newAction()
              .setFunctionName("updateScenario")
              .setParameters({ index: index.toString(), original: scenario })))
          .addButton(CardService.newTextButton()
            .setText("Delete")
            .setOnClickAction(CardService.newAction()
              .setFunctionName("deleteScenario")
              .setParameters({ index: index.toString() }))));
    });
  }

  section.addWidget(CardService.newTextButton()
    .setText("Back")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("returnToComposeCard")));

  card.addSection(section);
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().pushCard(card.build()))
    .build();
}

function updateScenario(e) {
  Logger.log("updateScenario called");
  const index = parseInt(e.parameters.index);
  const original = e.parameters.original;
  const newValue = e.formInput[`scenario_${index}`]?.trim();

  if (!newValue) {
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText("Scenario name cannot be empty"))
      .build();
  }

  let scenarios = getScenarios();
  const editableScenarios = scenarios.filter(s => s !== "Others");

  if (editableScenarios.some((s, i) => i !== index && s.toLowerCase() === newValue.toLowerCase())) {
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText("This scenario already exists"))
      .build();
  }

  const actualIndex = scenarios.indexOf(original);
  if (actualIndex !== -1) {
    scenarios[actualIndex] = newValue;
    saveScenarios(scenarios);
  }

  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation()
      .popToRoot()
      .updateCard(showComposeCard(e)[0]))
    .setNotification(CardService.newNotification()
      .setText("Scenario updated successfully"))
    .build();
}

function deleteScenario(e) {
  Logger.log("deleteScenario called");
  const index = parseInt(e.parameters.index);

  let scenarios = getScenarios();
  const editableScenarios = scenarios.filter(s => s !== "Others");
  const scenarioToDelete = editableScenarios[index];

  const actualIndex = scenarios.indexOf(scenarioToDelete);
  if (actualIndex !== -1) {
    scenarios.splice(actualIndex, 1);
    saveScenarios(scenarios);
  }

  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation()
      .popToRoot()
      .updateCard(showComposeCard(e)[0]))
    .setNotification(CardService.newNotification()
      .setText("Scenario deleted successfully"))
    .build();
}

function returnToComposeCard(e) {
  Logger.log("returnToComposeCard called");
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation()
      .popToRoot()
      .updateCard(showComposeCard(e)[0]))
    .build();
}

function toggleEmojiFeedback(e) {
  Logger.log("toggleEmojiFeedback called");
  const formInput = e.formInput || {};
  const useEmojis = formInput.emojiToggle && formInput.emojiToggle.includes("useEmojis") ? true : false;
  Logger.log("toggleEmojiFeedback: useEmojis set to " + useEmojis);
  PropertiesService.getUserProperties().setProperty("useEmojis", useEmojis.toString());
  Logger.log("toggleEmojiFeedback: Saved useEmojis as " + useEmojis);


  // Get the pageMode from the parameters
  const pageMode = e.parameters.pageMode;

  // Update the appropriate card based on the pageMode
  let currentCard;
  if (pageMode === "reply") {
    currentCard = showReplyCard(e);
  } else if (pageMode === "compose") {
    currentCard = showComposeCard(e);
  } else {
    // Fallback to Compose mode if pageMode is undefined (shouldn't happen with proper setup)
    currentCard = showComposeCard(e);
  }

  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().updateCard(currentCard[0]))
    .setNotification(CardService.newNotification().setText(useEmojis ? "Emojis enabled! 😊" : "Emojis disabled!"))
    .build();
}

function generateEmail(e) {
  Logger.log("generateEmail called");
  const formData = e.formInput;
  const pageMode = e.parameters.pageMode; // Get pageMode
  const isComposeMode = !formData.replyEmail;

  if (!formData.recipientDetails) {
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification().setText("Please enter recipient details."))
      .build();
  }
  if (!isComposeMode && !formData.replyEmail) {
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification().setText("Please enter the email to reply to."))
      .build();
  }

  const useEmojisFromForm = formData.emojiToggle;
  const savedEmojiState = JSON.parse(PropertiesService.getUserProperties().getProperty("useEmojis") || "false");
  const useEmojis = useEmojisFromForm !== undefined ? useEmojisFromForm : savedEmojiState;
  Logger.log("generateEmail: Final useEmojis value: " + useEmojis);

  let prompt = "";
  let scenario = formData.scenario;

  if (isComposeMode) {
    scenario = (formData.scenario === "Others" && formData.customScenario) ? formData.customScenario : formData.scenario;
    if (!scenario) {
      return CardService.newActionResponseBuilder()
        .setNotification(CardService.newNotification().setText("Please select a scenario or enter a custom scenario."))
        .build();
    }
    prompt = `Generate a ${formData.style} email with a ${formData.tone} tone for the scenario: ${scenario}. Recipient details: ${formData.recipientDetails}. Additional info: ${formData.additionalInfo || ""}. Creativity level: ${formData.creativityLevel}. Language: ${formData.language || "English"}. ${useEmojis ? "Add relevant emojis to enhance the message (e.g., 😊👍 for positive, ⏰ for deadlines)." : "Do not include any emojis."}`;
  } else {
    prompt = `Generate a ${formData.style} email reply with a ${formData.tone} tone and ${formData.responseChoice} response to this email: "${formData.replyEmail}". Recipient details: ${formData.recipientDetails}. Additional info: ${formData.additionalInfo || ""}. Creativity level: ${formData.creativityLevel}. Language: ${formData.language || "English"}. ${useEmojis ? "Add relevant emojis to enhance the message (e.g., 😊👍 for positive, ⏰ for deadlines)." : "Do not include any emojis."}`;
  }

  Logger.log("Prompt sent to API: " + prompt);

  const GEMINI_API_KEY = "AIzaSyAoSdTiXXROp6tk6jvhzum_cg1X_Wjtp7Y"; // Replace with your Gemini API key
  try {
    const response = UrlFetchApp.fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      contentType: "application/json",
      payload: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: formData.creativityLevel === "Quite Creative" ? 0.9 : 0.7,
          maxOutputTokens: 300
        }
      })
    });

    const result = JSON.parse(response.getContentText());
    const generatedText = result.candidates[0].content.parts[0].text.trim();

    Logger.log("Generated Email Content:\n" + generatedText);

    PropertiesService.getUserProperties().setProperty("lastGeneratedEmail", generatedText);
    // GmailApp.createDraft("", "", generatedText);


    // Save the generated email and create a draft
    PropertiesService.getUserProperties().setProperty("lastGeneratedEmail", generatedText);
    const draft = GmailApp.createDraft("", "", generatedText); // Create draft in Gmail

    const improveCard = CardService.newCardBuilder()
      .setHeader(CardService.newCardHeader().setTitle("Improve Draft"))
      .addSection(CardService.newCardSection()
        .addWidget(CardService.newTextParagraph().setText(generatedText))
        .addWidget(CardService.newTextInput()
          .setFieldName("improveInstructions")
          .setTitle("Improve Instructions")
          .setHint("e.g., Make it shorter"))
        .addWidget(CardService.newButtonSet()
          .addButton(CardService.newTextButton()
            .setText("Improve")
            .setOnClickAction(CardService.newAction().setFunctionName("improveEmail")))
          .addButton(CardService.newTextButton()
            .setText("Send to Gmail Compose")
            .setOnClickAction(CardService.newAction()
              .setFunctionName("sendToGmailCompose")
              .setParameters({ draftId: draft.getId() }))) // Pass draft ID
          .addButton(CardService.newTextButton()
            .setText("Back")
            .setOnClickAction(CardService.newAction().setFunctionName(isComposeMode ? "showComposeCard" : "showReplyCard")))))
      .build();

    return CardService.newActionResponseBuilder()
      .setNavigation(CardService.newNavigation().pushCard(improveCard))
      .setNotification(CardService.newNotification().setText("Draft created! Improve it below."))
      .build();
  } catch (error) {
    Logger.log("Error generating email: " + error.message);
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification().setText("Failed to generate email: " + error.message))
      .build();
  }
}


function sendToGmailCompose(e) {
  Logger.log("sendToGmailCompose called");
  const draftId = e.parameters.draftId;

  if (!draftId) {
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification().setText("No draft ID found."))
      .build();
  }

  // Get the draft URL
  const draftUrl = `https://mail.google.com/mail/u/0/#drafts?compose=${draftId}`; // Opens the draft in Gmail

  return CardService.newActionResponseBuilder()
    .setOpenLink(CardService.newOpenLink()
      .setUrl(draftUrl)
      .setOpenAs(CardService.OpenAs.FULL_SIZE)
      .setOnClose(CardService.OnClose.NOTHING))
    .setNotification(CardService.newNotification().setText("Opening Gmail draft..."))
    .build();
}

function improveEmail(e) {
  Logger.log("improveEmail called");
  const formData = e.formInput;
  const originalText = PropertiesService.getUserProperties().getProperty("lastGeneratedEmail");
  const instructions = formData.improveInstructions || "Improve the email";

  if (!originalText) {
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification().setText("No previous draft found to improve."))
      .build();
  }

  const prompt = `Improve this email content: "${originalText}". Instructions: ${instructions}.`;
  const GEMINI_API_KEY = "AIzaSyAoSdTiXXROp6tk6jvhzum_cg1X_Wjtp7Y"; // Replace with your Gemini API key
  try {
    const response = UrlFetchApp.fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      contentType: "application/json",
      payload: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 300 }
      })
    });

    const result = JSON.parse(response.getContentText());
    const improvedText = result.candidates[0].content.parts[0].text.trim();
    PropertiesService.getUserProperties().setProperty("lastGeneratedEmail", improvedText);
    GmailApp.createDraft("", "", improvedText);

    const updatedCard = CardService.newCardBuilder()
      .setHeader(CardService.newCardHeader().setTitle("Improve Draft"))
      .addSection(CardService.newCardSection()
        .addWidget(CardService.newTextParagraph().setText(improvedText))
        .addWidget(CardService.newTextInput()
          .setFieldName("improveInstructions")
          .setTitle("Improve Instructions")
          .setHint("e.g., Make it shorter"))
        .addWidget(CardService.newButtonSet()
          .addButton(CardService.newTextButton()
            .setText("Improve Again")
            .setOnClickAction(CardService.newAction().setFunctionName("improveEmail")))
          .addButton(CardService.newTextButton()
            .setText("Back")
            .setOnClickAction(CardService.newAction().setFunctionName("showComposeCard")))))
      .build();

    return CardService.newActionResponseBuilder()
      .setNavigation(CardService.newNavigation().updateCard(updatedCard))
      .setNotification(CardService.newNotification().setText("Draft improved and saved!"))
      .build();
  } catch (error) {
    Logger.log("Error improving email: " + error.message);
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification().setText("Failed to improve email: " + error.message))
      .build();
  }
}