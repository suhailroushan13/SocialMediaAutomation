import pymongo
import json
import tweepy
import config
import requests
import threading

with open('../server/captions.json') as f:
    config = json.load(f)
    tweet = config[-1]

def foo():
    client = tweepy.Client(consumer_key="bGa6bYgn6UrfoffUXMRlNaQhY",
    consumer_secret="Svt3YrK7SbL3dD3a0EhpYGIcRE3zkEZXW9DZiiE0sTaaL4n5zG",
    access_token="1566649762341740549-vipn7mnd8DcplaCKJ21C5w2Ijs38EO",
    access_token_secret="FXXq0KnK0BtDv5PzjaQpeJyU2HrW8qv2FHJl5tv0yKtjB")
    tweets = tweet
    response = client.create_tweet(text=tweets)
    print("Twitted On Twitter")

    
foo()


