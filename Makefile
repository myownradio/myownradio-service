MASTER_IP_ADDRESS = $(shell cd terraform && terraform output mor_master_ip_address)

install-deployer-private-key:
	(cd terraform && \
		(terraform output deployer_private_key > ~/.ssh/deployer_key) && \
		(terraform output deployer_public_key > ~/.ssh/deployer_key.pub) \
	)
	chmod 0600 ~/.ssh/deployer_key ~/.ssh/deployer_key.pub

authorize-on-master:
	cat ~/.ssh/id_rsa.pub | ssh -i ~/.ssh/deployer_key deployer@$(MASTER_IP_ADDRESS) "cat >> ~/.ssh/authorized_keys"

add-docker-context:
	docker context create --docker host=ssh://deployer@$(MASTER_IP_ADDRESS) mor-master
