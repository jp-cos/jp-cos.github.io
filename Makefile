default: all ttl2html

all:
	catttl code2broader cs-items cs-metadata cs-period cs-revision cs-dataset dataset disability-category \
	  schema-class schema-property school section-label shapes stage subject subjectArea > all-`date +%Y%m%d`.ttl
	rapper -c -i turtle all-`date +%Y%m%d`.ttl
	gzip -9 all-`date +%Y%m%d`.ttl
	ls -l all-`date +%Y%m%d`.ttl.gz

ttl2html:
	bundle exec ttl2html all-`date +%Y%m%d`.ttl.gz
	cd en && bundle exec ttl2html ../all-`date +%Y%m%d`.ttl.gz
