const test = require('node:test');
const assert = require('node:assert/strict');
const {
  campaignUpdateSchema,
  resourceUpdateSchema,
  agencyUpdateSchema
} = require('../utils/validation');

test('content updates reject moderation and ownership fields', () => {
  const protectedFields = ['status', 'adminNotes', 'organizer', 'author', 'submittedBy'];

  for (const [type, schema] of [
    ['campaign', campaignUpdateSchema],
    ['resource', resourceUpdateSchema],
    ['agency', agencyUpdateSchema]
  ]) {
    for (const field of protectedFields) {
      assert.ok(schema.validate({ [field]: 'forged' }).error, `${type} accepted ${field}`);
    }
  }
});

test('content update schemas accept valid partial edits and reject empty updates', () => {
  assert.equal(
    campaignUpdateSchema.validate({ title: 'Updated cleanup campaign' }).error,
    undefined
  );
  assert.equal(
    resourceUpdateSchema.validate({ title: 'Updated plastic resource' }).error,
    undefined
  );
  assert.equal(
    agencyUpdateSchema.validate({ name: 'Updated recycling center' }).error,
    undefined
  );

  for (const schema of [campaignUpdateSchema, resourceUpdateSchema, agencyUpdateSchema]) {
    assert.ok(schema.validate({}).error);
  }
});

test('my-content routes are matched before dynamic id routes', () => {
  for (const routePath of [
    '../routes/campaigns',
    '../routes/resources',
    '../routes/agencies'
  ]) {
    const router = require(routePath);
    const paths = router.stack
      .filter((layer) => layer.route)
      .map((layer) => layer.route.path);
    const myContentPath = paths.findIndex((path) => path.startsWith('/my/'));
    const dynamicIdPath = paths.indexOf('/:id');

    assert.notEqual(myContentPath, -1, `${routePath} is missing its my-content route`);
    assert.notEqual(dynamicIdPath, -1, `${routePath} is missing its detail route`);
    assert.ok(myContentPath < dynamicIdPath, `${routePath} matches the detail route first`);
  }
});
