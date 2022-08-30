default: clean all ttl2html

all:
	catttl cs-items cs-metadata cs-period cs-revision cs-dataset dataset disability-category \
	  schema-class schema-property school section-hierarchy shapes stage subject subjectArea > all-`date +%Y%m%d`.ttl
	rapper -c -i turtle all-`date +%Y%m%d`.ttl
	gzip -9 -f all-`date +%Y%m%d`.ttl
	ls -l all-`date +%Y%m%d`.ttl.gz

ttl2html:
	bundle exec ttl2html all-`date +%Y%m%d`.ttl.gz
	cd en && bundle exec ttl2html ../all-`date +%Y%m%d`.ttl.gz

clean:
	-rm -rf [78][0-9A-Za-z][0-9A-Za-z]/ Kidergarden*/ Elementary*/ LowerSecondary*/ UpperSecondary*/ disabilityCategory/ period/ school/ stage/
