import http from 'k6/http';
// import { sleep } from 'k6';

// This script is used to test the load balancing of a voting system.
// First test is smoke test to ensure the service is up and running.
export let options = {
  vus: 100, // number of virtual users
  duration: '10s', // duration of test
};

export default function () {
  http.get('http://voting-system-327120321.ap-southeast-2.elb.amazonaws.com/session/all');
}
