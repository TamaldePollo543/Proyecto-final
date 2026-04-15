import { BASIC_CONTENT } from './basic.js';
import { INTERMEDIATE_CONTENT } from './intermediate.js';
import { ADVANCED_CONTENT } from './advanced.js';

const ALL_CONTENT = {
    ...BASIC_CONTENT,
    ...INTERMEDIATE_CONTENT,
    ...ADVANCED_CONTENT
};

export const ContentLoader = {
    getContent(topicId) {
        return ALL_CONTENT[topicId] || null;
    }
};
