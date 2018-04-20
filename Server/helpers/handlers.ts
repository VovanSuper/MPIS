function handleError(e: Error | string) {
  console.warn('Error executing query');

  if (e instanceof Error) {
    console.error(`${e.name} ------- ${e.message}`);
    console.error(`${e.stack}`);
  } else {
    console.error(e);
  }
  return null;
}

function svcCtorLogger(svc: Function) {
  console.log(`${svc.name} ctor...`);
}


export { handleError, svcCtorLogger }