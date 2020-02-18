install-deployer-ssh-key:
	(cd terraform && terraform output deployer_private_key) > ~/.ssh/deployer_private_key
