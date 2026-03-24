export type Tags = 'virtualcard' | 'guide' | 'terms' | 'company' | 'finance' | 'engineering' | 'product' | 'report' | 'people' | 'history' | 'technology'

export type Post = {
	title: string
	slug: string
	description: string
	image: string
	createdAt: string
	updatedAt: string
	tag: Tags
	published: boolean
	author: string
}