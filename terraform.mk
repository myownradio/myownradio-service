terraform-init:
	(cd terraform && terraform init)

terraform-apply: terraform-init
	(cd terraform && terraform apply -auto-approve)
