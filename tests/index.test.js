const axios2 = require("axios");

const BACKEND_URL = "http://localhost:5000";

const axios = {
  post: async (...args) => {
    try {
      const res = axios2.post(...args);
    } catch (error) {
      return error.response;
    }
  },
  get: async (...args) => {
    try {
      const res = await axios2.get(...args);
      return res;
    } catch (e) {
      return e.response;
    }
  },
  put: async (...args) => {
    try {
      const res = await axios2.put(...args);
      return res;
    } catch (e) {
      return e.response;
    }
  },
  delete: async (...args) => {
    try {
      const res = await axios2.delete(...args);
      return res;
    } catch (e) {
      return e.response;
    }
  },
};

const username = "rahul" + Math.random(); // rahul0.121213
const email = "rg4005450@gmail.com";
const password = "123456@rahul";

describe("Auth", () => {
  test("User is able to signup only once", async () => {
    const response = axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      email,
      password,
    });
    expect(response.status).toBe(201);
    const response2 = axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      email,
      password,
    });
    expect(response2.status).toBe(400);
  });
  test("Signup request fails if username or email turns to be empty", async () => {
    const response = axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username: "",
      email,
      password,
    });
    expect(response.status).toBe(400);
    const response2 = axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      email,
      password,
    });
    expect(response2.status).toBe(400);
  });
  test("Sign in should be done if credentials (username or email) are correct", async () => {
    const response = axios.post(`${BACKEND_URL}/api/v1/signin`, {
      email,
      password,
    });
    expect(response.status).toBe(200);
    const response2 = axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });
    expect(response2.status).toBe(200);
  });
  test("Sign In should not be done if password is incorrect", async () => {
    const response3 = axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password: "wrongpassword",
    });
    expect(response3.status).toBe(400);
    const response4 = axios.post(`${BACKEND_URL}/api/v1/signin`, {
      email,
      password: "wrongpassword",
    });
    expect(response4.status).toBe(400);
  });
  test("Sign In should not be done if email and username both are empty", async () => {
    const response5 = axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username: "",
      email: "",
      password: "wrongpassword",
    });
    expect(response5.status).toBe(400);
  });
});

describe("User metadata endpoint", async () => {
  let token = "";
  let avatarId = "";
  const username = "rahul" + Math.random(); // rahul0.121213
  const email = "rahul24010009@gmail.com";
  const password = "anonyms";

  beforeAll(async () => {
    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      email,
      password,
    });
    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });
    token = response.data.token;

    const avatarResponse = await axios.post(
      `${BACKEND_URL}/api/v1/avatar`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        name: "Timmy",
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Avatar Response is " + avatarResponse.data.avatarId);
    avatarId = avatarResponse.data.avatarId;
  });

  test("User cant update their metadata without a wrong avatar id", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/metadata`,
      {
        avatarId: "wrongAvatarId",
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(response.status).toBe(400);
  });

  test("User can update thrie metadata with the right avatar id", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/metadata`,
      {
        avatarId,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(response.status).toBe(200);
  });

  test("User is not able to update their metadata if the auth header is not present", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
      avatarId,
    });
    expect(response.status).toBe(403);
  });
});

describe("User avatar information", () => {
  let token = "";
  let avatarId = "";
  let userId = "";

  beforeAll(async () => {
    const username = "rahul" + Math.random();
    const email = "rahul24012006@gmail.com";
    const password = "anonyms123@rahul";

    const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      email,
      password,
      type: "admin",
    });
    userId = signupResponse.data.userId;

    console.log("User id " + userid);

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });
    token = response.data.token;

    const avatarResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/avatar`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        name: "Jimmy",
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    avatarId = avatarResponse.data.avatarId;
  });

  test("Get back avatar information for a user", async () => {
    console.log("asking for user with id " + userId);
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userid}]`
    );
    console.log("response was " + userId);
    console.log(JSON.stringify(response.data));
    expect(response.data.avatars.length).toBe(1);
    expect(response.data.avatars[0].userId).toBe(userId);
  });

  test("Available avatars lists the recently created avatar", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/avatars`);
    expect(response.data.avatars.length).not.toBe(0);
    const currentAvatar = response.data.avatars.find((x) => x.id === avatarId);
    expect(currentAvatar).toBeDefined();
  });
});

describe("Space Information", () => {
  let mapId;
  let element1Id;
  let element2Id;
  let adminToken;
  let adminId;
  let userToken;
  let userId;

  beforeAll(async () => {
    const username = `rahul+${Match.random}`;
    const email = "123@gmail.com";
    const password = "1234@rahul1";
    const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    adminId = signupResponse.data.userId;

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });
    adminToken = response.data.token;

    const userSignupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        username: username + "-user",
        password,
        type: "user",
      }
    );

    userId = userSignupResponse.data.userId;

    const userSigninResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signin`,
      {
        username: username + "-user",
        password,
      }
    );

    userToken = userSigninResponse.data.token;
    const element1Response = await axios.post(
      `${BACKEND_URL}/api/v2/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const element2Response = await axios.post(
      `${BACKEND_URL}/api/v2/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    element1Id = element1Response.data.id;
    element2Id = element2Response.data.id;

    console.log(element1Id);
    console.log(element2Id);

    const mapResponse = await axios.post(
      `${BACKEND_URL}/api/v2/admin/map`,
      {
        thumbnail: "https://thumbnail.com/a.png",
        name: "Test Space",
        defaultElements: [
          {
            elementId: element1Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 30,
            y: 30,
          },
          {
            elementId: element1Id,
            x: 40,
            y: 40,
          },
        ],
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    console.log("Map Response Status");
    console.log(mapResponse.data.id);
    mapId = mapResponse.data.id;
  });

  test("User is able to create a space", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        mapId: mapId,
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(response.status).toBe(201);
    expect(response.data.spaceId).toBeDefined();
  });

  test("User is able to create a space without mapid (empty space)", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(response.status).toBe(201);
    expect(response.data.spaceId).toBeDefined();
  });

  test("User is not able to delete a space that does not exist", async () => {
    const response = await axios.delete(
      `${BACKEND_URL}/api/v1/space/83264782364`,
      {
        headers: `Bearer ${userToken}`,
      }
    );
    expect(response.status).toBe(400);
  });

  test("User is able to delete a space that exist", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test1",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    const responseDelete = await axios.delete(
      `${BACKEND_URL}/api/v1/space/${response.data.spaceId}`,
      {
        headers: `Bearer ${userToken}`,
      }
    );

    expect(responseDelete.status).toBe(200);
  });

  test("User is not able to delete a space created by another user", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test2",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    const responseDelete = await axios.delete(
      `${BACKEND_URL}/api/v1/space/${response.data.spaceId}`,
      {
        headers: `Bearer ${adminToken}`,
      }
    );
    expect(responseDelete.status).toBe(403);
  });

  test("Admin has no space initially", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
      headers: {
        authorization: `Bearer ${adminToken}`,
      },
    });
    expect(response.data.spaces.length).toBe(0);
  });

  test("Admin has get once space after", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test1",
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    console.log(response.data);

    const adminSpaces = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
      headers: {
        authorization: `Bearer ${adminToken}`,
      },
    });
    const filteredSpace = adminSpaces.data.spaces.find(
      (x) => x.id === response.data.spaceId
    );
    expect(adminSpaces.data.spaces.length).toBe(2);
    expect(filteredSpace).toBeDefined();
  });
});
