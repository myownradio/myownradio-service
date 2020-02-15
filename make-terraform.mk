TERRAFORM_DIR := terraform/

terraform-init:
	terraform init $(TERRAFORM_DIR)

terraform-plan:
	terraform plan $(TERRAFORM_DIR)

terraform-apply:
	terraform apply $(TERRAFORM_DIR)

terraform-show:
	terraform show $(TERRAFORM_DIR)
