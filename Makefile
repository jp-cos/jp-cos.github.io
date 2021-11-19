all:
	catttl code2broader cs-items cs-metadata cs-period cs-revision dataset disability-category school \
	  section-label stage subject subjectArea > all-`date +%Y%y%d`.ttl
