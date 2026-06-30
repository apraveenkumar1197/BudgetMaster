pipeline {
    agent any

    environment {
        // Set these in Jenkins → Manage Jenkins → System → Global properties
        // or override per-job in the job configuration.
        DOCKER_REGISTRY  = "${env.DOCKER_REGISTRY ?: 'docker.io/yourusername'}"
        API_IMAGE        = "${DOCKER_REGISTRY}/budgetmaster-api"
        FRONTEND_IMAGE   = "${DOCKER_REGISTRY}/budgetmaster-frontend"
        IMAGE_TAG        = "${BUILD_NUMBER}"
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    stages {

        // ── 1. CHECKOUT ──────────────────────────────────────────────────────
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // ── 2. TEST (parallel) ───────────────────────────────────────────────
        stage('Test') {
            parallel {

                stage('Laravel – PHPUnit') {
                    steps {
                        dir('laravel') {
                            // Run tests inside a throwaway PHP container so the
                            // Jenkins agent needs no PHP installation.
                            sh '''
                                docker run --rm \
                                  -v "$(pwd)":/app \
                                  -w /app \
                                  -e APP_ENV=testing \
                                  -e APP_KEY=base64:testonlykeytestonlykeytestonly= \
                                  -e DB_CONNECTION=sqlite \
                                  -e DB_DATABASE=:memory: \
                                  php:8.2-cli \
                                  sh -c "
                                    curl -sS https://getcomposer.org/installer | php &&
                                    php composer.phar install --no-interaction --prefer-dist --optimize-autoloader &&
                                    php vendor/bin/phpunit --testdox
                                  "
                            '''
                        }
                    }
                }

                stage('React – Jest') {
                    steps {
                        dir('reactjs') {
                            sh '''
                                docker run --rm \
                                  -v "$(pwd)":/app \
                                  -w /app \
                                  node:20-alpine \
                                  sh -c "
                                    npm ci --prefer-offline &&
                                    CI=true npm test -- --watchAll=false
                                  "
                            '''
                        }
                    }
                }
            }
        }

        // ── 3. BUILD DOCKER IMAGES ───────────────────────────────────────────
        stage('Build') {
            steps {
                withCredentials([
                    string(credentialsId: 'react-api-base-url', variable: 'REACT_APP_API_BASE_URL')
                ]) {
                    sh '''
                        docker build \
                          -t ${API_IMAGE}:${IMAGE_TAG} \
                          -t ${API_IMAGE}:latest \
                          ./laravel

                        docker build \
                          --build-arg REACT_APP_API_BASE_URL="${REACT_APP_API_BASE_URL}" \
                          -t ${FRONTEND_IMAGE}:${IMAGE_TAG} \
                          -t ${FRONTEND_IMAGE}:latest \
                          ./reactjs
                    '''
                }
            }
        }

        // ── 4. PUSH TO REGISTRY ──────────────────────────────────────────────
        stage('Push') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'docker-registry-credentials',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    sh '''
                        echo "${DOCKER_PASS}" | docker login ${DOCKER_REGISTRY} \
                          -u "${DOCKER_USER}" --password-stdin

                        docker push ${API_IMAGE}:${IMAGE_TAG}
                        docker push ${API_IMAGE}:latest

                        docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
                        docker push ${FRONTEND_IMAGE}:latest
                    '''
                }
            }
        }

        // ── 5. DEPLOY ────────────────────────────────────────────────────────
        stage('Deploy') {
            steps {
                withCredentials([
                    sshUserPrivateKey(
                        credentialsId: 'deploy-server-ssh',
                        keyFileVariable:  'SSH_KEY',
                        usernameVariable: 'SSH_USER'
                    ),
                    string(credentialsId: 'laravel-app-key',          variable: 'APP_KEY'),
                    string(credentialsId: 'laravel-oauth-client-id',  variable: 'OAUTH_CLIENT_ID'),
                    string(credentialsId: 'laravel-oauth-client-secret', variable: 'OAUTH_CLIENT_SECRET'),
                    string(credentialsId: 'db-root-password',         variable: 'DB_ROOT_PASSWORD'),
                    string(credentialsId: 'db-password',              variable: 'DB_PASSWORD'),
                    string(credentialsId: 'react-api-base-url',       variable: 'REACT_APP_API_BASE_URL'),
                    usernamePassword(
                        credentialsId: 'docker-registry-credentials',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    // Write the .env that docker compose will read on the server
                    sh '''
                        cat > deploy.env <<EOF
APP_ENV=production
APP_KEY=${APP_KEY}
APP_DEBUG=false
APP_URL=http://${DEPLOY_HOST:-localhost}:8080
DB_DATABASE=budgetmaster
DB_ROOT_PASSWORD=${DB_ROOT_PASSWORD}
DB_USERNAME=budgetmaster
DB_PASSWORD=${DB_PASSWORD}
OAUTH_CLIENT_ID=${OAUTH_CLIENT_ID}
OAUTH_CLIENT_SECRET=${OAUTH_CLIENT_SECRET}
REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL}
API_IMAGE_TAG=${IMAGE_TAG}
FRONTEND_IMAGE_TAG=${IMAGE_TAG}
EOF
                    '''

                    // Copy compose files and .env to the server, then pull & restart
                    sh '''
                        SCP_OPTS="-o StrictHostKeyChecking=no -i ${SSH_KEY}"
                        SSH_CMD="ssh -o StrictHostKeyChecking=no -i ${SSH_KEY} ${SSH_USER}@${DEPLOY_HOST}"

                        # Ensure deploy directory exists
                        $SSH_CMD "mkdir -p ~/budgetmaster"

                        # Copy compose files
                        scp $SCP_OPTS docker-compose.yml          ${SSH_USER}@${DEPLOY_HOST}:~/budgetmaster/docker-compose.yml
                        scp $SCP_OPTS docker-compose.prod.yml     ${SSH_USER}@${DEPLOY_HOST}:~/budgetmaster/docker-compose.prod.yml
                        scp -r $SCP_OPTS docker/                  ${SSH_USER}@${DEPLOY_HOST}:~/budgetmaster/docker/
                        scp $SCP_OPTS deploy.env                  ${SSH_USER}@${DEPLOY_HOST}:~/budgetmaster/.env

                        # Login to registry on the server, pull new images, restart
                        $SSH_CMD "
                          cd ~/budgetmaster &&
                          echo '${DOCKER_PASS}' | docker login ${DOCKER_REGISTRY} -u '${DOCKER_USER}' --password-stdin &&
                          docker compose -f docker-compose.yml -f docker-compose.prod.yml pull &&
                          docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --remove-orphans &&
                          docker image prune -f
                        "
                    '''
                }
            }
        }
    }

    // ── POST ─────────────────────────────────────────────────────────────────
    post {
        always {
            // Remove locally built images to keep the agent disk clean
            sh '''
                docker rmi ${API_IMAGE}:${IMAGE_TAG}      || true
                docker rmi ${API_IMAGE}:latest            || true
                docker rmi ${FRONTEND_IMAGE}:${IMAGE_TAG} || true
                docker rmi ${FRONTEND_IMAGE}:latest       || true
                rm -f deploy.env
            '''
        }
        success {
            echo "Deployment of build #${BUILD_NUMBER} succeeded."
        }
        failure {
            echo "Pipeline failed at stage: ${env.STAGE_NAME}. Check the logs above."
        }
    }
}
