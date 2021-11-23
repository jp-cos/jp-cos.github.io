all:
	catttl code2broader cs-items cs-metadata cs-period cs-revision dataset disability-category \
	  schema-class schema-property school section-label shapes stage subject subjectArea > all-`date +%Y%m%d`.ttl
	gzip -9 all-`date +%Y%m%d`.ttl
