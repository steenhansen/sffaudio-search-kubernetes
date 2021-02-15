

 
  


# [Kubernetes](https://www.linode.com/products/kubernetes/) SFFaudio-Search on Linode.com

  

  

[SFFaudio-Search](http://192.53.120.71) was a single page Node.js app that was injected into [SFFaudio.com](https://www.sffaudio.com/)'s WordPress search page. It was discontinued because of human intervention needed for manual linking of text posts. It enabled fast and easy searching of SFFaudio's online content of [authors](http://192.53.120.71/?author=larry-niven), [stories](http://192.53.120.71/?book=beyond-lies-the-wub&author=philip-k-dick), [blog-posts](http://192.53.120.71/?book=beyond-lies-the-wub&author=philip-k-dick&view=post_book&choice=4), [PDFs](http://192.53.120.71/?book=beyond-lies-the-wub&author=philip-k-dick&view=pdf&choice=1), and [MP3s](http://192.53.120.71/?book=beyond-lies-the-wub&author=philip-k-dick&view=rsd&choice=1).

  
The data is held in Google Sheets for easy text editing; [PDF data](https://docs.google.com/spreadsheets/d/1sbQ8NR7hvcm4EjSlyhmte0rYtI_G3vnc1o5KLPAW2lc/),
 [RSD data](https://docs.google.com/spreadsheets/d/1VFMgWy6wmTkFIpeNW-NkZdWmpz5iZcuULgMpjn8_QgU/), and 
 [Podcast data](https://docs.google.com/spreadsheets/d/1cWtA1AaY83cBuU_6vt64adDeR-dfT-X1U5VgvCRVMAg/). Then a [Neo4j](https://neo4j.com/) graph database links the data, while [Vis.js](http://visjs.org/) is used to display the interactive relationships. PDFs are displayed via [PDF.js](https://github.com/mozilla/pdf.js) on the canvas. The four small icons in the bottom left and right of the widget

- show help
- resize the graph to window size
- shrink the graph
- grow the graph
  

#### Philip K. Dick's "Beyond Lies the Wub" found after searching for 'dick':

![visual explanation](https://github.com/steenhansen/sffaudio-search/blob/master/beyond-the-wub-book.png)

Four blog posts, a PDF, an RSD, an MP3, a Wikipedia story link, and a link back to the author.

#### After clicking on "RSD # 7" a user can play the associated MP3 while reading along with the PDF:

![visual explanation](https://github.com/steenhansen/sffaudio-search/blob/master/beyond-the-wub-rsd.png)


## Docker Run program locally on Windows

Steps | &nbsp;
------------ | -------------
Get Docker | [Download](https://hub.docker.com/editions/community/docker-ce-desktop-windows/) Docker Desktop for Windows
Enter /docker-images/ | *$ cd docker-images*
Launch program | *$ docker-run&period;bat*
View web page | *http://localhost/?author=philip-k-dick* (5 books)
View Neo4j database | *http://localhost:7474/browser*
Update Neo4j database | *http://localhost:81/cron-new-db-version-81* (wait 2 minutes)
View 7413 books | *http://localhost/* (refresh to clear cache)

#### Docker Desktop after docker-run.bat has exectued:

![visual explanation](https://github.com/steenhansen/sffaudio-search-kubernetes/blob/master/docker_run.png)

&nbsp;
&nbsp;
&nbsp;

  
## Deploy program on a Linode Kubernetes Cluster 


Steps | &nbsp;
------------ | -------------
Get Linode Account | [Sign up](https://login.linode.com/signup) for Linode Cloud
Get kubectl | [Install](https://kubernetes.io/docs/tasks/tools/install-kubectl/) kubectl on Windows
Configure KUBECONFIG | $ setx KUBECONFIG "C:\kubes\linode-kube-config.yaml"
Start LKE | [Make a Kubernetes Cluster](https://cloud.linode.com/kubernetes/clusters) 
Create a 3 node cluster| 3 Linode 2GB for a total of $30 a month
Copy kubeconfig.yaml file | into C:\kubes\linode-kube-config.yaml
Start cluster | $ kubectl apply -k ./   
Wait for 4 pods to start | $ kubectl get pods -w

![visual explanation](https://github.com/steenhansen/sffaudio-search-kubernetes/blob/master/kubectl_get_pods.png)

&nbsp; | &nbsp;
------------ | -------------
Get EXTERNAL service IPs | $ kubectl get svc
&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp; neo4j--db--service 104.200.26.55
&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; http://104.200.26.55:7474/browser/
&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; password=yer_password 
&nbsp; | 
&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;node--webserver--service 104.200.27.60
&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; http://104.200.27.60 (empty database)

![visual explanation](https://github.com/steenhansen/sffaudio-search-kubernetes/blob/master/kubectl_get_svc.png)


&nbsp; | &nbsp;
------------ | -------------
Launch CronJob | edit cron--job.yaml for an immediate cronjob run
&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;schedule: "17 * * * *"  # start 17 minutes after every hour cron job
&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;#schedule: "43 0 * * 0" # stop weekly cron job 
Set cron job run time | $ kubectl apply -f cron--job.yaml
&nbsp; | $ kubectl get pods -w to see cron job launch in a pod
&nbsp; | 
&nbsp; | Wait until *(20315) Node labels in Neo4j browser (up to 10 minutes) 
View full database | http://104.200.27.60 (refresh might be needed to clear cache)

#### Linode interface after cluster has started:

![visual explanation](https://github.com/steenhansen/sffaudio-search-kubernetes/blob/master/lke.png)


## Caveats
- The Node.js Neo4j-driver used in this project is [1.7.7](https://www.npmjs.com/package/neo4j-driver/v/1.7.7), very old, the current version is 4.2.1 and is not backwards compatible
- The [Neo4j Docker](https://hub.docker.com/_/neo4j) image used in this project is 3.4.9, very old, the current version is 4.2.2 and is not backwards compatible
- Mobile css is not handled correctly anymore as this program's output was meant to be displayed inside of Wordpress pages

## Created by

[Steen Hansen](https://github.com/steenhansen)
