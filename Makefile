MASTER_IP_ADDRESS = $(shell cd terraform && terraform output mor_eu_master_ip_address)

install-deployer-ssh-key:
	(cd terraform && terraform output deployer_private_key) > ~/.ssh/deployer_private_key
	chmod 0600 ~/.ssh/deployer_private_key

connect-master:
	ssh -i ~/.ssh/deployer_private_key root@$(MASTER_IP_ADDRESS)
