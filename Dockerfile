FROM python

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN apt-get update && apt-get install -y nodejs yarn

WORKDIR /app
COPY package.json .
COPY yarn.lock .
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
