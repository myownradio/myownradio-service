deploy-to-production:
	scp -r deployment/docker-swarm/ deployer@$(MASTER_IP_ADDRESS):/home/deployer/
	ssh deployer@$(MASTER_IP_ADDRESS) "cd /home/deployer/docker-swarm && . apply.sh"
