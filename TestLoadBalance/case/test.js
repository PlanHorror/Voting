import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 400, // number of virtual users
  duration: '10s', // duration of test
};

export default function () {
  http.get('http://voting-system-327120321.ap-southeast-2.elb.amazonaws.com/session/all');
  sleep(1); // simulate user think time
}
