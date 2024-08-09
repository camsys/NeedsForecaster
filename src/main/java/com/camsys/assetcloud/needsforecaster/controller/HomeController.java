package com.camsys.assetcloud.needsforecaster.controller;

import com.camsys.assetcloud.controller.BasePage;
import com.camsys.assetcloud.auth.AssetCloudOidcUserPrincipal;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;

@Controller
public class HomeController extends BasePage {

	@Value( "${asset-cloud.version}" )
	private String assetCloudVersionId = null;

	@Value( "${asset-cloud.release-notes-url}" )
	private String assetCloudRelNotesUrl = null;

	@Value( "${asset-cloud.training-url}" )
	private String assetCloudTrainingUrl = null;

	@GetMapping("/")
	public String index(Model model) throws Exception {
		return "index";
	}	

	@ModelAttribute("USER_NAME")
	public String getCurrentUserName() {
		return "User Name";
	}

	@ModelAttribute("USER_IS_ADMIN")
	public boolean userIsAdmin() {
		return true;
	}

	@ModelAttribute("VERSION")
	public String getVersion() {
		return assetCloudVersionId;
	}

	@ModelAttribute("RELEASE_NOTES_URL")
	public String getRelNotesUrl() {
		return assetCloudRelNotesUrl;
	}

	@ModelAttribute("TRAINING_URL")
	public String getTrainingUrl() {
		return assetCloudTrainingUrl;
	}

}