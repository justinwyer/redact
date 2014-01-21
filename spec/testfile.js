var features = {locateAtm: true, createBeneficary: false}

if (features.locateAtm) {
	console.log("Locate ATM");
	if (features.createBeneficary) {
		console.log("Inner Create Beneficary");
	}
}

if (features.createBeneficary) {
	console.log("Create Beneficary");
}