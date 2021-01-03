/**
 * Fetching Challenges Service
 *
 */
import { axiosInstance as axios } from "./requestInterceptor";
import { getAuthUserProfile } from "@topcoder/micro-frontends-navbar-app";
import config from "../../config";

// export const getMyChallengesix = async() => {
//   const {userId} = await getAuthUserProfile()
//   debugger;
//   console.log(a)

// }

export const getResourceRoles = ()=> {
  return axios.get(`${config.API.V5}/resource-roles?`).then(({data})=> {
    return _.filter(data, (r)=> {
      return r.name === 'Submitter' || r.name === 'Reviewer' || r.name ==='Copilot'
    })
  });
}

export const getChallengeRole = (challengeId) => {
  return axios.get(`${config.API.V5}/resources/?challengeId=${challengeId}&perPage=100&page=1`);
}

export const getResourceByChallengeId = (challengeId) => {
  // axios.get(`${config.API.V5}/resource-roles`);
  // axios.get(`${config.API.V5}/roles`);
  return axios.get(`${config.API.V5}/resources/?challengeId=${challengeId}&perPage=10&page=1`);
};

/**
 * Get my challenges.
 *
 * @returns {Promise<object[]>} list of challenges
 */
const getChallenges = () => {
  // return axios.get(`${config.API.V5}/challenges/?status=Active&perPage=100`);
  return axios.get(`${config.API.V5}/challenges/?status=Active&perPage=50`);
};


export const  getMyChallenges = ()=> {
  return getResourceRoles().then((roles)=> {
    return getChallenges().then(({data: challengeList})=> {
      const challengeRolesPromise = []
      _.forEach(challengeList, (challenge)=> {
        challengeRolesPromise.push(getResourceByChallengeId(challenge.id)) 
      })
      return Promise.all(challengeRolesPromise).then((res)=> {
        _.forEach(res, (cRoles, index)=> {
          const resource = _.find(roles, (r)=> {
            const findRole = _.find(cRoles.data, (cr)=> {
              return r.id === cr.roleId
            })
            if (findRole) {
              return true
            }
          })
          if (resource) {
            challengeList[index].role = resource.name
          }else {
            challengeList[index].role = '-'
          }
        })
        return {data: challengeList}
      })
    })
  })
}

/**
 * Get challenge by id.
 *
 * @param {string|number} challengeId challenge id
 *
 * @returns {Promise<{}>} challenge object
 */
export const getChallengeById = async(challengeId) => {

  // await getResourceByChallengeId(challengeId)
  return axios.get(
    `${config.API.V5}/challenges/${challengeId}`
  );
};

export const getMyChallengeById = (challengeId) => {

//   await getResourceByChallengeId(challengeId)
//   return axios.get(
//     `${config.API.V5}/challenges/${challengeId}`
//   );

  return getResourceRoles().then((roles)=> {
        debugger;
    return getChallengeById(challengeId).then(({data: challenge})=> {
      return getResourceByChallengeId(challengeId).then(({data:cRoles})=> {
        debugger;
        const resource = _.find(roles, (r)=> {
          const findRole = _.find(cRoles, (cr)=> {
            return r.id === cr.roleId
          })
          if (findRole) {
            return true
          }
        })
        if (resource) {
          challenge.role = resource.name
        }else {
          challenge.role = '-'
        }
        return {data: challenge}
      })
    })
  })

};



export const getSubmissions = async(challengeId) => {
  return axios.get(`${config.API.V5}/submissions/?challengeId=${challengeId}&perPage=10&page=1`);
};
